import { Entity } from "../../core/entities/entity"

export interface BookingProps {
    userId: string;
    conferenceId: string;
}

export class Booking extends Entity<BookingProps> {
    
}