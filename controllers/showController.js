import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

// controller to get now playing movies
export const getNowPlayingMovies = async (req, res) => {
  try {
    const data = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          accept: "application/json",
        },
      }
    );
    console.log("data\\\\\\\\\\\\\\\\\\", data);
    const movies = await data.data.results;
    console.log("movioessss", movies);
    res.json({ success: true, movies });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

// controller to add a new show to the database
export const addShow = async (req, res) => {
  try {
    console.log("reqppppppppppppppppppp", req);
    const { movieId, showsInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);
    if (!movie) {
      // fetch movie details from TMDB movies
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            accept: "application/json",
          },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            accept: "application/json",
          },
        }),
      ]);
      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };
      //   add movie to database
      movie = await Movie.create(movieDetails);
    }
    const showsToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });
    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }
    res.json({
      success: true,
      message: "Show Added Successfully",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

// api to get all the shows
export const getShows = async (req, res) => {
  try {
    console.log("dsajksadj;ldsaf");
    const shows = await Show.find({
      showDateTime: {
        $gte: new Date(),
      },
    })
      .populate("movie")
      .sort({ showDateTime: 1 });
    const uniqueShows = new Set(shows.map((show) => show.movie));
    res.json({
      success: true,
      shows: Array.from(uniqueShows),
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

// api to get a show
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({
      movie: movieId,
      showDateTime: {
        $gte: new Date(),
      },
    });
    const movie = await Movie.findById(movieId);
    const dateTime = {};
    shows.forEach((show) => {
      const date = show.showDateTime.toISOString.split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
      });
    });
    res.json({
      success: true,
      movie,
      dateTime,
    });
  } catch (err) {
    console.log(err);
  }
};
