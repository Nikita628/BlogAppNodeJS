import { IPage } from "../../models/page";
import { IPost } from "../../models/post";

export interface IFeedService {
  getPosts(): Promise<IPage<IPost>>;
}
