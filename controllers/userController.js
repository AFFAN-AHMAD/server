import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

//  api controller function to get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;
    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: {
          path: "movie",
        },
      })
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

// api controller function to update favorite movie

export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;
    const user = await clerkClient.users.getUser(userId);
    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [];
    }

    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId);
    } else {
      user.privateMetadata.favorites = user.privateMetadata.favorites.filter(
        (item) => item != movieId
      );
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMedata: user.privateMetadata,
    });

    res.json({
      success: true,
      message: "Favorite movies updated",
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);
    const favorites = user.privateMetadata.favorites;

    // get movies from db
    const movies = await Movie.find({
      _id: {
        $in: favorites,
      },
    });

    res.json({
      success: true,
      movies,
    });
  } catch (err) {
    console.log(err);
  }
};
