import mongoose from "mongoose";
import BlogDoc, { Blog } from "./interfaces/blog";

const Schema = mongoose.Schema

const blogSchema = new Schema({
  author: {type: String, required: true},
  description: {type: String},
  imageUrl: {type: String, required: true},
  tags: [{type: String}],
})

export default mongoose.model<BlogDoc>('Blog', blogSchema)