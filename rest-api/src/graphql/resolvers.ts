import { authService } from "../services";
import { ISignupData } from "./models/signup-data";

export const resolver = {
  async signup({ signupData }: { signupData: ISignupData }) {
    const user = await authService.signup(
      signupData.email,
      signupData.password,
      signupData.name
    );

    return user;
  },
};
