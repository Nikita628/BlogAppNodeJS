import { Request } from "express";
import { IPageParam } from "../models/page";
import { IPost, IPostCreateData } from "../models/post";
import { ILoginResult, IUser } from "../models/user";
import { authService, feedService, userService } from "../services";
import { socket } from "../utils/socket";
import { ILoginData } from "./models/login-data";
import { ISignupData } from "./models/signup-data";
import { IStatus } from "./models/status";
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

  async getStatus(_, req: Request): Promise<IStatus> {
    const authorization = authorize(req);
    const result = await userService.getStatus(authorization.userId);

    return { status: result };
  },
  async updateStatus({ status }: IStatus, req: Request): Promise<IStatus> {
    const authorization = authorize(req);
    const result = await userService.updateStatus(status, authorization.userId);

    return { status: result };
  },

  async createPost(
    { post }: { post: IPostCreateData },
    req: Request
  ): Promise<{ post: IPost }> {
    const authorization = authorize(req);

    post.creator = authorization.userId;

    const result = await feedService.createPost(post);

    socket.getSocketIO().emit("posts", { action: "create", post });

    return { post: result };
  },
  async posts({
    pageParam,
  }: {
    pageParam: IPageParam;
  }): Promise<{ posts: IPost[]; totalItems: number }> {
    const posts = await feedService.getPosts({
      page: pageParam.page,
      pageSize: pageParam.pageSize,
    });

    return {
      posts: posts.items,
      totalItems: posts.total,
    };
  },
};
