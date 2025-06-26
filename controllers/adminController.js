// api to check if user is admin

import Booking from "../models/Booking";

export const isAdmin = async (req, res) => {
  res.json({
    success: true,
    isAdmin: true,
  });
};

// api to get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({
      isPaid: true,
    });

    const activeShows = await Show.find({
      showDateTime: {
        $gte: new Date(),
      },
    }).populate("movie");

    const totalUser = await User.countDocuments();

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
    };

    res.json({
      success: true,
      dashboardData,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: true,
      message: err.message,
    });
  }
};
