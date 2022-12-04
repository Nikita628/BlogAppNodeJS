import { NextFunction, Request, Response } from "express";

export function errorHandling(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("error: ", error);
  const status = error.status ?? 500;
  const message = error.message ?? "Something went wrong";
  const errors = error.errors ?? [];
  res.status(status).json({ message, errors });
}
