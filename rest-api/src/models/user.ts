import { IPost } from "./post";

export interface IUser {
  id: string;
  name: string;
  email: string;
  posts: IPost[];
}

export interface ILoginResult {
  token: string;
  userId: string;
}
