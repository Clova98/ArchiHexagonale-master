import { Executable } from "../../core/executable.interface"
import { User } from "../../user/entities/user.entity"
import { IConferenceRepository } from "../ports/conference-repository.interface"
import { IBookingRepository } from "../ports/booking-repository.interface"
import { Booking } from "../entities/booking.entity"
import { ConferenceNotFoundException } from "../exceptions/conference-not-found"

type BookSeatRequest = {
    user: User,
    conferenceId: string
}

type BookSeatResponse = void

export class BookSeat implements Executable<BookSeatRequest, BookSeatResponse> {
    constructor(
        private readonly conferenceRepository: IConferenceRepository,
        private readonly bookingRepository: IBookingRepository
    ) {}

    async execute({ user, conferenceId }: BookSeatRequest): Promise<BookSeatResponse> {
        const conference = await this.conferenceRepository.findById(conferenceId)

        if (!conference) {
            throw new ConferenceNotFoundException()
        }

        const existingBookings = await this.bookingRepository.findByConferenceId(conferenceId)

        if (existingBookings.length >= conference.props.seats) {
            throw new Error("No more seats available for this conference")
        }

        const newBooking = new Booking({
            userId: user.props.id,
            conferenceId: conference.props.id
        })

        await this.bookingRepository.create(newBooking)
    }
}