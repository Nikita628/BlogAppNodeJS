export interface IUserService {
  getStatus(userId: string): Promise<string>;
  updateStatus(status: string, userId: string): Promise<string>;
}
