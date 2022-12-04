import { IPage } from "../../models/page";
import { IPost, IPostCreateData, IPostEditData, IPostFilterParam } from "../../models/post";

export interface IFeedService {
  getPosts(filter: IPostFilterParam): Promise<IPage<IPost>>;
  createPost(post: IPostCreateData): Promise<IPost>;
  getPost(id: string): Promise<IPost | null>;
  updatePost(post: IPostEditData): Promise<IPost>;
  deletePost(id: string): Promise<void>;
}
