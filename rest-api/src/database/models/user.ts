import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: '',
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
  }
);

export const UserModel = mongoose.model("User", userSchema);
