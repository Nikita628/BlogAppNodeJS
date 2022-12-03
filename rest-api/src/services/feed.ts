import { IPost } from "../models/post";
import { IFeedService } from "./contracts/feed";

export class FeedService implements IFeedService {
  async getPosts(): Promise<IPost[]> {
    return [{id: 1, text: 'text'}];
  }
}