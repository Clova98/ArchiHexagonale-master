import { Application } from 'express'
import request from 'supertest'
import { IBookingRepository } from '../conference/ports/booking-repository.interface'
import container from '../infrastructure/express_api/config/dependency-injection'
import { e2eConference } from './seeds/conference-seeds'
import { e2eUsers } from './seeds/user-seeds'
import { TestApp } from './utils/test-app'

describe('Feature: Booking a seat', () => {
    let testApp: TestApp
    let app: Application

    beforeEach(async () => {
        testApp = new TestApp()
        await testApp.setup()
        await testApp.loadAllFixtures([e2eUsers.johnDoe, e2eConference.conference1])
        app = testApp.expressApp
    })

    afterAll(async () => {
        await testApp.tearDown()
    })

    describe('Scenario: Happy path', () => {
        it('should book a seat for the user', async () => {
            const conferenceId = e2eConference.conference1.entity.props.id

            const result = await request(app)
                .post(`/conference/${conferenceId}/book`)
                .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                .send()

            expect(result.status).toBe(201)

            const bookingRepository = container.resolve('bookingRepository') as IBookingRepository
            const bookings = await bookingRepository.findByConferenceId(conferenceId)

            expect(bookings.length).toBe(1)
            expect(bookings[0].props.userId).toBe(e2eUsers.johnDoe.entity.props.id)
        })
    })

    describe('Scenario: User is not authorized', () => {
        it('should return 403 Unauthorized', async () => {
            const conferenceId = e2eConference.conference1.entity.props.id

            const result = await request(app)
                .post(`/conference/${conferenceId}/book`)
                .send()

            expect(result.status).toBe(403)
        })
    })
})