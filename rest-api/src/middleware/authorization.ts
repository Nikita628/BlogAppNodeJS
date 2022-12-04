import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { createError } from "../utils/error";

export function authorization(req: Request, res: Response, next: NextFunction) {
  const token = req.get("Authorization")?.split(" ")[1];

  if (!token) {
    throw createError("missing token", 401);
  }

  try {
    const decodedToken: any = jwt.verify(token, config.secret);

    if (!decodedToken) {
      throw new Error();
    }

    req.params.userId = decodedToken.userId;

    next();
  } catch (error) {
    throw createError("invalid token", 401);
  }
}
