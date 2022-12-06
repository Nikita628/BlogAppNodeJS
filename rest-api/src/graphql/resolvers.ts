import { Request } from "express";
import { ILoginResult, IUser } from "../models/user";
import { authService, userService } from "../services";
import { ILoginData } from "./models/login-data";
import { ISignupData } from "./models/signup-data";
import { authorize } from "./utils";

export const resolver = {
  async signup({ signupData }: { signupData: ISignupData }): Promise<IUser> {
    const user = await authService.signup(
      signupData.email,
      signupData.password,
      signupData.name
    );

    return user;
  },
  async login({ email, password }: ILoginData): Promise<ILoginResult> {
    const result = await authService.login(email, password);
    return result;
  },
  async getStatus(args: any, req: Request): Promise<{ status: string }> {
    const authorization = authorize(req);
    const result = await userService.getStatus(authorization.userId);

    return { status: result };
  },
  async updateStatus(
    {
      status,
    }: {
      status: string;
    },
    req: Request
  ): Promise<{ status: string }> {
    const authorization = authorize(req);
    const result = await userService.updateStatus(status, authorization.userId);

    return { status: result };
  },
};
