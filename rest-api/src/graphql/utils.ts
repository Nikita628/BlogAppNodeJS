import { Request } from "express";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { createError } from "../utils/error";

export function errorFormatter(err: any): GraphQLFormattedError {
  if (err instanceof GraphQLError) {
    return {
      message: err.message,
    };
  } else {
    return {
      message: (err as any).message ?? "Something went wrong",
    };
  }
}

export function authorize(req: Request): { userId: string } {
  const token = req.get("Authorization")?.split(" ")[1];

  if (!token) {
    throw createError('not authorized', 401);
  }

  const result: {userId: string} = { userId: '' };

  try {
    const decodedToken: any = jwt.verify(token, config.secret);

    if (!decodedToken) {
      throw createError('not authorized', 401);
    }

    result.userId = decodedToken.userId;
  } catch (error) {
    throw createError('not authorized', 401);
  }

  return result;
}
