import { ILoginResult, IUser } from "../../models/user";

export interface IAuthService {
  signup(email: string, password: string, name: string): Promise<IUser>;
  login(email: string, password: string): Promise<ILoginResult>;
  getStatus(userId: string): Promise<string>;
  updateStatus(status: string, userId: string): Promise<string>;
}
