import { AwilixContainer } from "awilix";
import { Booking } from "../../conference/entities/booking.entity";
import { IFixture } from "./fixture-interface";
import { IBookingRepository } from "../../conference/ports/booking-repository.interface";


export class BookingFixture implements IFixture {
    constructor(public entity: Booking) {}

    async load(container: AwilixContainer): Promise<void> {
        const repository = container.resolve('bookingRepository') as IBookingRepository
        await repository.create
    }
}