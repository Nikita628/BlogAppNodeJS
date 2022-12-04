import { IAuthService } from "./contracts/auth";
import bcryp from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../database/models/user";
import { ILoginResult, IUser } from "../models/user";
import { createError } from "../utils/error";
import { config } from "../config";

export class AuthService implements IAuthService {
  async updateStatus(status: string, userId: string): Promise<string> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw createError("user does not exist", 404);
    }

    user.status = status;
    await user.save();

    return user.status;
  }

  async getStatus(userId: string): Promise<string> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw createError("user does not exist", 404);
    }

    return user.status;
  }

  async login(email: string, password: string): Promise<ILoginResult> {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      throw createError("incorrect email and/or password", 401);
    }

    const areEqual = await bcryp.compare(password, user.password);

    if (!areEqual) {
      throw createError("incorrect email and/or password", 401);
    }

    const token = jwt.sign(
      {
        email,
        userId: user.id,
      },
      config.secret,
      { expiresIn: "10h" }
    );

    return {
      token,
      userId: user.id,
    };
  }

  async signup(email: string, password: string, name: string): Promise<IUser> {
    const encryptedPassword = await bcryp.hash(password, 12);

    const user = new UserModel({
      email,
      password: encryptedPassword,
      name,
      posts: [],
    });

    await user.save();

    return {
      email: user.email,
      id: user.id,
      name: user.name,
      posts: [],
    };
  }
}
