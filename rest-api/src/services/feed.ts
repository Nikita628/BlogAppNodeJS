import { IPage } from "../models/page";
import { IPost } from "../models/post";
import { IFeedService } from "./contracts/feed";

export class FeedService implements IFeedService {
  async getPosts(): Promise<IPage<IPost>> {
    return {
      items: [
        {
          author: "author",
          content: "asdsad",
          createdAt: new Date(),
          id: 1,
          imageUrl: "images/placeholder.jpg",
          title: "title",
          creator: { name: 'creator' },
        },
      ],
      total: 1,
    };
  }
}
