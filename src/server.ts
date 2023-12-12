import { app } from "./app";
import mongoose from "mongoose";
import "dotenv/config";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";

const PORT = process.env.PORT;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

const server = async () => {
  if (process.env.NODE_ENV && process.env.NODE_ENV === "dev") {
    if (!MONGODB_CONNECTION_STRING) {
      throw new BadRequestError("MONGODB_CONNECTION_STRING not defined");
    }

    try {
      console.log("connecting to mongodb...");
      await mongoose.connect(MONGODB_CONNECTION_STRING as string);
      console.log("connected to mongodb :)");
    } catch (error) {
      console.log("There is an error in connecting to mongoDb");
      console.error(error);
    }

    app.listen(PORT, () => {
      console.log(
        `V1 location-service running on port ${PORT} running in dev mode`
      );
    });
  }
};

server();
