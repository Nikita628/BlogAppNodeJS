import { ILoginResult, IUser } from "../models/user";
import { authService } from "../services";
import { ILoginData } from "./models/login-data";
import { ISignupData } from "./models/signup-data";

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
};
