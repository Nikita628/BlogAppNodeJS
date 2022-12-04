import { Result, ValidationError } from "express-validator";
import { IError } from "../models/error";

export function createValidationError(
  error: Result<ValidationError>,
  message: string
): IError {
  return {
    status: 400,
    message,
    errors: error.array().map((e) => ({ message: e.msg })),
  };
}

export function createNotFoundError(message: string): IError {
  return {
    status: 404,
    message,
    errors: [],
  };
}
