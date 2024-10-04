import { Booking } from "../entities/booking.entity";
import { IBookingRepository } from "../ports/booking-repository.interface";
import { BookingProps } from "../entities/booking.entity";

export class InMemoryBookingRepository implements IBookingRepository {
    private bookings: Booking[] = [];

    async create(booking: Booking): Promise<void> {
        this.bookings.push(booking);
    }

    async findByConferenceId(id: string): Promise<Booking[]> {
        return this.bookings.filter(booking => booking.props.conferenceId === id);
    }
}