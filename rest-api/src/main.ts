import bodyParser from "body-parser";
import express from "express";
import path from "path";

import { accessControl } from "./middleware/accessControl";
import { feedRouter } from "./routes/feed";
import { rootPath } from "./utils/path";
import { connectDb } from "./database/connection";
import { errorHandling } from "./middleware/errorHandling";
import { fileStorage } from "./middleware/fileStorage";

const app = express();

// middleware
app.use(bodyParser.json());
app.use(accessControl);
app.use("/images", express.static(path.join(rootPath, "images")));
app.use(fileStorage());

// routes
app.use("/feed", feedRouter);

// error handling middleware
app.use(errorHandling);

// start the app
(async function () {
  await connectDb();
  app.listen(3001);
})();
