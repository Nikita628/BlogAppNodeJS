import { PostModel } from "../database/models/post";
import { IPage } from "../models/page";
import {
  IPost,
  IPostCreateData,
  IPostEditData,
  IPostFilterParam,
} from "../models/post";
import { IFeedService } from "./contracts/feed";

export class FeedService implements IFeedService {
  async deletePost(id: string): Promise<void> {
    await PostModel.findByIdAndDelete(id);
  }

  async updatePost(post: IPostEditData): Promise<IPost> {
    const existingPost = await PostModel.findById(post.id);

    if (!existingPost) {
      throw new Error("post does not exist");
    }

    existingPost.content = post.content;
    existingPost.title = post.title;
    existingPost.imageUrl = post.imageUrl;

    await existingPost.save();

    return {
      content: existingPost.content,
      creator: existingPost.creator,
      id: existingPost.id,
      imageUrl: existingPost.imageUrl,
      title: existingPost.title,
      createdAt: existingPost.createdAt,
      updatedAt: existingPost.updatedAt,
    };
  }

  async getPost(id: string): Promise<IPost | null> {
    const post = await PostModel.findById(id);

    if (!post) {
      return null;
    }

    return {
      content: post.content,
      creator: post.creator,
      id: post.id,
      imageUrl: post.imageUrl,
      title: post.title,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async createPost(post: IPostCreateData): Promise<IPost> {
    const newPost = new PostModel({
      content: post.content,
      creator: {
        name: post.author,
      },
      imageUrl: post.imageUrl,
      title: post.title,
    });

    const createdPost = await newPost.save();

    return {
      id: createdPost.id,
      content: createdPost.content,
      title: createdPost.title,
      imageUrl: createdPost.imageUrl,
      creator: createdPost.creator,
      createdAt: createdPost.createdAt,
    };
  }

  async getPosts(filter: IPostFilterParam): Promise<IPage<IPost>> {
    const posts = await PostModel.find()
      .skip((filter.page - 1) * filter.pageSize)
      .limit(filter.pageSize);
      
    const total = await PostModel.countDocuments();

    return {
      total,
      items: posts.map((p) => ({
        content: p.content,
        createdAt: p.createdAt,
        creator: p.creator,
        id: p.id,
        imageUrl: p.imageUrl,
        title: p.title,
        updatedAt: p.updatedAt,
      })),
    };
  }
}
