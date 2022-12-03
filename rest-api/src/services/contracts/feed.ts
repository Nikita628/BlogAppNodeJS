import { IPost } from "../../models/post";

export interface IFeedService {
  getPosts(): Promise<IPost[]>;
}
