import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { authorization } from "../middleware/authorization";
import { feedService } from "../services";
import { createNotFoundError, createValidationError } from "../utils/error";
import { executeSafely } from "../utils/safeExecutor";

const feedRouter = express.Router();

feedRouter.get(
  "/posts",
  authorization,
  executeSafely(async (req, res) => {
    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 2;

    const posts = await feedService.getPosts({
      page: +page,
      pageSize: +pageSize,
    });

    res.status(200).json({
      posts: posts.items,
      totalItems: posts.total,
    });
  })
);

feedRouter.get(
  "/post/:id",
  authorization,
  executeSafely(async (req, res) => {
    const post = await feedService.getPost(req.params.id);

    if (!post) {
      throw createNotFoundError("post not found");
    }

    res.status(200).json({ post });
  })
);

feedRouter.post(
  "/post",
  authorization,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  executeSafely(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw createValidationError(errors, "validation failed");
    }

    const post = await feedService.createPost({
      creator: req.params.userId,
      content: req.body.content,
      imageUrl: req.file?.filename ?? "",
      title: req.body.title,
    });

    res.status(201).json({ post });
  })
);

feedRouter.put(
  "/post",
  authorization,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  executeSafely(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw createValidationError(errors, "validation failed");
    }

    const post = await feedService.updatePost({
      id: req.body.id,
      content: req.body.content,
      imageUrl: req.file?.filename ?? req.body.imageUrl,
      title: req.body.title,
    });

    res.status(200).json({ post });
  })
);

feedRouter.delete(
  "/post/:id",
  authorization,
  executeSafely(async (req: Request, res: Response) => {
    await feedService.deletePost(req.params.id);
    res.status(200).json({});
  })
);

export { feedRouter };
