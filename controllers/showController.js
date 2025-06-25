import axios from "axios";

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
