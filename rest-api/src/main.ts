import bodyParser from "body-parser";
import express from "express";
import path from "path";
import { graphqlHTTP } from "express-graphql";

import { accessControl } from "./middleware/accessControl";
import { feedRouter } from "./routes/feed";
import { rootPath } from "./utils/path";
import { connectDb } from "./database/connection";
import { errorHandling } from "./middleware/errorHandling";
import { fileStorage } from "./middleware/fileStorage";
import { authRouter } from "./routes/auth";
import { socket } from "./utils/socket";
import { userRouter } from "./routes/user";
import { schema } from "./graphql/schema";
import { resolver } from "./graphql/resolvers";
import { errorFormatter } from "./graphql/utils";
import { options } from "./middleware/options";

const app = express();

// middleware
app.use(bodyParser.json());
app.use(accessControl);
app.use("/images", express.static(path.join(rootPath, "images")));
app.use(fileStorage());
app.use(options);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
    customFormatErrorFn: errorFormatter,
  })
);

// routes
app.use("/feed", feedRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

// error handling middleware
app.use(errorHandling);

// start the app
(async function () {
  await connectDb();
  const server = app.listen(3001);
  const io = socket.init(server);

  io.on("connection", (socket) => {});
})();
