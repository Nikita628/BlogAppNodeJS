import { AuthService } from "./auth";
import { IAuthService } from "./contracts/auth";
import { IFeedService } from "./contracts/feed";
import { IUserService } from "./contracts/user";
import { FeedService } from "./feed";
import { UserService } from "./user";

export const feedService: IFeedService = new FeedService();
export const authService: IAuthService = new AuthService();
export const userService: IUserService = new UserService();