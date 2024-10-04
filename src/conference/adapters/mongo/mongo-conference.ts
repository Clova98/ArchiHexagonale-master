import mongoose, { Document, Schema } from 'mongoose';

export namespace MongoConference {
    export interface ConferenceDocument extends Document {
        _id: string;
        organizerId: string;
        title: string;
        seats: number;
        startDate: Date;
        endDate: Date;
    }

    const conferenceSchema = new Schema({
        _id: String,
        organizerId: String,
        title: String,
        seats: Number,
        startDate: Date,
        endDate: Date
    });

    export const ConferenceModel = mongoose.model<ConferenceDocument>('Conference', conferenceSchema);
}

export default MongoConference;