import express from "express";
import { feedService } from "../services";

const feedRouter = express.Router();

feedRouter.get("/posts", async (req, res) => {
  const posts = await feedService.getPosts();
  res.status(200).json({
    posts: posts.items,
    totalItems: posts.total,
  });
});

export { feedRouter };
