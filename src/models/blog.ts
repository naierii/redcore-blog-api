import mongoose from "mongoose";
import BlogDoc from "./interfaces/blog";

const Schema = mongoose.Schema

const blogSchema = new Schema({
  author: {type: String, required: true},
  description: {type: String},
  images: {type: String}
})

export default mongoose.model<BlogDoc>('Blog', blogSchema)