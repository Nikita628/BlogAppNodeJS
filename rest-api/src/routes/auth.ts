import express from "express";
import { body, validationResult } from "express-validator";
import { authorization } from "../middleware/authorization";
import { authService } from "../services";
import { createValidationError } from "../utils/error";
import { executeSafely } from "../utils/safeExecutor";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  executeSafely(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw createValidationError(errors, "validation failed");
    }

    const user = await authService.signup(
      req.body.email,
      req.body.password,
      req.body.name
    );

    res.status(201).json({ userId: user.id });
  })
);

router.post(
  "/login",
  executeSafely(async (req, res) => {
    const result = await authService.login(req.body.email, req.body.password);

    res.status(201).json(result);
  })
);

router.get(
  "/status",
  authorization,
  executeSafely(async (req, res) => {
    const result = await authService.getStatus(req.params.userId);

    res.status(200).json({ status: result });
  })
);

router.put(
    "/status",
    authorization,
    executeSafely(async (req, res) => {
      const result = await authService.updateStatus(req.body.status, req.params.userId);
  
      res.status(200).json({ status: result });
    })
  );

export { router as authRouter };
