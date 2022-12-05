import express from "express";
import { authorization } from "../middleware/authorization";
import { userService } from "../services";
import { executeSafely } from "../utils/safeExecutor";

const router = express.Router();

router.get(
  "/status",
  authorization,
  executeSafely(async (req, res) => {
    const result = await userService.getStatus(req.params.userId);

    res.status(200).json({ status: result });
  })
);

router.put(
  "/status",
  authorization,
  executeSafely(async (req, res) => {
    const result = await userService.updateStatus(
      req.body.status,
      req.params.userId
    );

    res.status(200).json({ status: result });
  })
);

export { router as userRouter };
