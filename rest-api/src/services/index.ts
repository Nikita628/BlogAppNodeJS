import { AuthService } from "./auth";
import { IAuthService } from "./contracts/auth";
import { IFeedService } from "./contracts/feed";
import { FeedService } from "./feed";

export const feedService: IFeedService = new FeedService();
export const authService: IAuthService = new AuthService();