import { PostModel } from "../database/models/post";
import { UserModel } from "../database/models/user";
import { IPage } from "../models/page";
import {
  IPost,
  IPostCreateData,
  IPostEditData,
  IPostFilterParam,
} from "../models/post";
import { createError } from "../utils/error";
import { IFeedService } from "./contracts/feed";

export class FeedService implements IFeedService {
  async deletePost(id: string): Promise<void> {
    const post = await PostModel.findById(id).populate("creator");

    if (!post) {
      throw createError("post does not exist", 404);
    }

    const user = await UserModel.findById(post.creator._id.toString());

    if (!user) {
      throw createError('post without creator', 404);
    }

    UserModel.updateOne(
      { _id: user._id.toString() },
      { $pull: { posts: { creator: post.creator._id.toString() } } },
      { safe: true, multi: true },
    );

    await PostModel.findByIdAndDelete(id);
  }

  async updatePost(post: IPostEditData): Promise<IPost> {
    const existingPost = await PostModel.findById(post.id).populate("creator");

    if (!existingPost) {
      throw new Error("post does not exist");
    }

    existingPost.content = post.content;
    existingPost.title = post.title;
    existingPost.imageUrl = post.imageUrl;

    await existingPost.save();

    return {
      content: existingPost.content,
      creator: {
        id: existingPost.creator._id.toString(),
        name: (existingPost.creator as any).name,
      },
      id: existingPost.id,
      imageUrl: existingPost.imageUrl,
      title: existingPost.title,
      createdAt: existingPost.createdAt,
      updatedAt: existingPost.updatedAt,
    };
  }

  async getPost(id: string): Promise<IPost | null> {
    const post = await PostModel.findById(id).populate("creator");

    if (!post) {
      return null;
    }

    return {
      content: post.content,
      creator: {
        id: post.creator._id.toString(),
        name: (post.creator as any).name,
      },
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
      creator: post.creator,
      imageUrl: post.imageUrl,
      title: post.title,
    });

    const createdPost = await newPost.save();

    const user = await UserModel.findById(post.creator);

    if (!user) {
      throw createError("invalid post", 400);
    }

    user.posts.push(createdPost.id);
    await user.save();

    return {
      id: createdPost.id,
      content: createdPost.content,
      title: createdPost.title,
      imageUrl: createdPost.imageUrl,
      creator: {
        id: user.id,
        name: user.name,
      },
      createdAt: createdPost.createdAt,
    };
  }

  async getPosts(filter: IPostFilterParam): Promise<IPage<IPost>> {
    const posts = await PostModel.find()
      .populate("creator")
      .skip((filter.page - 1) * filter.pageSize)
      .limit(filter.pageSize);

    const total = await PostModel.countDocuments();

    return {
      total,
      items: posts.map((p) => ({
        content: p.content,
        createdAt: p.createdAt,
        creator: {
          id: p.creator._id.toString(),
          name: (p.creator as any).name,
        },
        id: p.id,
        imageUrl: p.imageUrl,
        title: p.title,
        updatedAt: p.updatedAt,
      })),
    };
  }
}
