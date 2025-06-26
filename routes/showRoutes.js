import express from "express";
import {
  addShow,
  getNowPlayingMovies,
  getShow,
  getShows,
} from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get("/now-playing", protectAdmin, getNowPlayingMovies);
showRouter.post("/add", protectAdmin, addShow);
showRouter.post("/all", protectAdmin, getShows);
showRouter.post("/:movieId", protectAdmin, getShow);

export default showRouter;
