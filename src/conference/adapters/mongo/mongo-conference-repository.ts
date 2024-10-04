import { Model } from 'mongoose';
import { Conference } from '../../entities/conference.entity';
import { IConferenceRepository } from '../../ports/conference-repository.interface';
import { MongoConference } from './mongo-conference';

export class MongoConferenceRepository implements IConferenceRepository {
    constructor(private model: Model<MongoConference.ConferenceDocument>) {}

    async create(conference: Conference): Promise<void> {
        await this.model.create({
            _id: conference.props.id,
            organizerId: conference.props.organizerId,
            title: conference.props.title,
            seats: conference.props.seats,
            startDate: conference.props.startDate,
            endDate: conference.props.endDate
        });
    }

    async findById(id: string): Promise<Conference | null> {
        const document = await this.model.findById(id);
        if (!document) return null;

        return new Conference({
            id: document._id,
            organizerId: document.organizerId,
            title: document.title,
            seats: document.seats,
            startDate: document.startDate,
            endDate: document.endDate
        });
    }

    async update(conference: Conference): Promise<void> {
        await this.model.findByIdAndUpdate(conference.props.id, {
            organizerId: conference.props.organizerId,
            title: conference.props.title,
            seats: conference.props.seats,
            startDate: conference.props.startDate,
            endDate: conference.props.endDate
        });
    }
}

export * from './mongo-conference-repository'