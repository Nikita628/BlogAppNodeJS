export interface IError {
  status: number;
  message: string;
  errors: { message: string }[];
}
