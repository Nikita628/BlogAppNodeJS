import { UserModel } from "../database/models/user";
import { createError } from "../utils/error";
import { IUserService } from "./contracts/user";

export class UserService implements IUserService {
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
}
