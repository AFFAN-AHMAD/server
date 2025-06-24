import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("DB connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`);
  } catch (err) {
    console.log("ERROR", err);
  }
};

export default connectDB;
