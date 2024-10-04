import { Model } from 'mongoose'
import { TestApp } from '../../../tests/utils/test-app'
import { MongoConference, MongoConferenceRepository } from '.'
import { testConference } from '../../tests/conference-seeds'
import { Conference } from '../../entities/conference.entity'

describe('MongoConferenceRepository Integration Tests', () => {
    let app: TestApp
    let model: Model<MongoConference.ConferenceDocument>
    let repository: MongoConferenceRepository

    beforeAll(async () => {
        app = new TestApp()
        await app.setup()
    })

    afterAll(async () => {
        await app.tearDown()
    })

    beforeEach(async () => {
        model = MongoConference.ConferenceModel
        await model.deleteMany({})
        repository = new MongoConferenceRepository(model)
    })

    describe('Scenario: findById', () => {
        it('should find conference corresponding to the id', async () => {
            await model.create(testConference.conference1.props)
            
            const conference = await repository.findById(testConference.conference1.props.id)
            expect(conference?.props).toEqual(testConference.conference1.props)
        })

        it('should return null if conference not found', async () => {
            const conference = await repository.findById('non-existing-id')
            expect(conference).toBeNull()
        })
    })

    describe('Scenario: Create a conference', () => {
        it('should create a conference', async () => {
            const newConference = new Conference({
                id: 'new-conference-id',
                organizerId: 'organizer-id',
                title: 'New Conference',
                seats: 100,
                startDate: new Date('2024-01-01T10:00:00.000Z'),
                endDate: new Date('2024-01-01T12:00:00.000Z')
            })

            await repository.create(newConference)
            const fetchedConference = await model.findOne({_id: 'new-conference-id'})

            expect(fetchedConference?.toObject()).toEqual({
                _id: 'new-conference-id',
                organizerId: 'organizer-id',
                title: 'New Conference',
                seats: 100,
                startDate: new Date('2024-01-01T10:00:00.000Z'),
                endDate: new Date('2024-01-01T12:00:00.000Z'),
                __v: 0
            })
        })
    })

    describe('Scenario: Update a conference', () => {
        it('should update a conference', async () => {
            await model.create(testConference.conference1.props)

            const conference = await repository.findById(testConference.conference1.props.id)
            if (!conference) throw new Error('Conference not found')

            conference.update({
                title: 'Updated Conference Title',
                seats: 200
            })

            await repository.update(conference)

            const updatedConference = await model.findOne({_id: testConference.conference1.props.id})
            expect(updatedConference?.title).toBe('Updated Conference Title')
            expect(updatedConference?.seats).toBe(200)
        })
    })
})