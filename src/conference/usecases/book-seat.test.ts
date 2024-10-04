import { BookSeat } from "./book-seat"
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository"
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository"
import { testUsers } from "../../user/tests/user-seeds"
import { testConference } from "../tests/conference-seeds"
import { Booking } from "../entities/booking.entity"

describe("Feature: Booking a seat", () => {
    let conferenceRepository: InMemoryConferenceRepository
    let bookingRepository: InMemoryBookingRepository
    let useCase: BookSeat

    beforeEach(async () => {
        conferenceRepository = new InMemoryConferenceRepository()
        bookingRepository = new InMemoryBookingRepository()
        useCase = new BookSeat(conferenceRepository, bookingRepository)

        await conferenceRepository.create(testConference.conference1)
    })

    describe("Scenario: Happy path", () => {
        it("should book a seat for the user", async () => {
            await useCase.execute({
                user: testUsers.bob,
                conferenceId: testConference.conference1.props.id
            })

            const bookings = await bookingRepository.findByConferenceId(testConference.conference1.props.id)
            expect(bookings.length).toBe(1)
            expect(bookings[0].props.userId).toBe(testUsers.bob.props.id)
        })
    })

    describe("Scenario: Conference does not exist", () => {
        it("should throw an error", async () => {
            await expect(useCase.execute({
                user: testUsers.bob,
                conferenceId: "non-existing-id"
            })).rejects.toThrow("Conference not found")
        })
    })

    describe("Scenario: No more seats available", () => {
        it("should throw an error", async () => {
            
            for (let i = 0; i < testConference.conference1.props.seats; i++) {
                await bookingRepository.create(new Booking({
                    userId: `user-${i}`,
                    conferenceId: testConference.conference1.props.id
                }))
            }

            await expect(useCase.execute({
                user: testUsers.bob,
                conferenceId: testConference.conference1.props.id
            })).rejects.toThrow("No more seats available for this conference")
        })
    })
})