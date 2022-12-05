import { GraphQLError, GraphQLFormattedError } from "graphql";

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
