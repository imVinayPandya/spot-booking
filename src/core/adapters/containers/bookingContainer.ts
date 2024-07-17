import { Container } from "inversify";

import { INTERFACE_TYPE } from "../../../utils/constants";
import {
  IBookingInteractor,
  IBookingRepository,
} from "../../../typings/Booking";
import { BookingRepository } from "../repositories/bookingRepository";
import { BookingInteractor } from "../../use-cases/interactors/bookingInteractor";
import { BookingController } from "../controllers/BookingController";

const container = new Container();

// repository
container
  .bind<IBookingRepository>(INTERFACE_TYPE.BookingRepository)
  .to(BookingRepository);

// interactor
container
  .bind<IBookingInteractor>(INTERFACE_TYPE.BookingInteractor)
  .to(BookingInteractor);

// controller
container.bind(INTERFACE_TYPE.BookingController).to(BookingController);

const bookingContainer = container.get<BookingController>(
  INTERFACE_TYPE.BookingController
);

export default bookingContainer;
