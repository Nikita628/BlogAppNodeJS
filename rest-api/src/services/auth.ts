import { IAuthService } from "./contracts/auth";
import bcryp from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../database/models/user";
import { ILoginResult, IUser } from "../models/user";
import { createError } from "../utils/error";
import { config } from "../config";

export class AuthService implements IAuthService {
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
    const existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
      throw createError("user already exists", 400);
    }

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
