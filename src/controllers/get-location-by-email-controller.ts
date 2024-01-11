import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import "dotenv/config";

const getLocationByEmailHandler = asyncHandler(
  async (req: Request, res: Response) => {
    res.send("Hello World!");
  }
);

export { getLocationByEmailHandler };
