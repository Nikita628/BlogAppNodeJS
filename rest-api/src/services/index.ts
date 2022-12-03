import { IFeedService } from "./contracts/feed";
import { FeedService } from "./feed";

export const feedService: IFeedService = new FeedService();