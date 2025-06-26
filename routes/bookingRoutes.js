import express from "express";
import {
  createBooking,
  getOccupiedSeats,
} from "../controllers/bookingController.js";
import { getUserBookings } from "../controllers/userController.js";

const bookingRouter = express.Router();
"/bookings", getUserBookings;

bookingRouter.post("/create", createBooking);
bookingRouter.get("/seats/:showId", getOccupiedSeats);

export default bookingRouter;
