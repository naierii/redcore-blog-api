import { Router } from "express";
import { createBlog, deleteBlog, editBlog, getBlog, getBlogs } from "../controllers/blog";

const blogRouter = Router();

blogRouter.post('/', createBlog)

blogRouter.get('/', getBlogs)
blogRouter.get('/:id', getBlog)

blogRouter.patch('/:id', editBlog)

blogRouter.delete('/:id', deleteBlog)

export default blogRouter