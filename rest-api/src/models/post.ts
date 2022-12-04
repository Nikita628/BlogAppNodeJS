import { IPageParam } from "./page";

export interface IPost {
  id: string;
  content: string;
  title: string;
  imageUrl: string;
  creator: { name: string };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPostCreateData {
  content: string;
  title: string;
  imageUrl: string;
  author: string;
}

export interface IPostEditData {
  id: string;
  content: string;
  title: string;
  imageUrl: string;
}


export interface IPostFilterParam extends IPageParam {
  title?: string;
}