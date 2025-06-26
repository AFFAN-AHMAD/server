import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const app = express();
const port = 3000;

// db connection
await connectDB();

// middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// api routes

app.get("/", (req, res) => {
  try {
    res.send("server is live");
  } catch (err) {
    console.log(err);
  }
});

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
