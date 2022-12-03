export interface IPost {
  id: number;
  content: string;
  title: string;
  imageUrl: string;
  author: string;
  creator: { name: string };
  createdAt: Date;
}
