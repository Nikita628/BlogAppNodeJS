import { NextFunction, Request, Response } from "express";

export function accessControl(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // We must set specific domain from a config file
  // here I will leave '*' just to save time
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
}
