import { RequestHandler } from "express"
import Blog from "../models/blog"
import HttpError from "../models/http-error"

export const createBlog:RequestHandler = async (req, res, next) => {
  const {description, image} = req.body
  const author = "Reian"

  const newBlog = new Blog({
    author, description, image
  })

  try{
    await newBlog.save()
  }catch(e){
    return next(new HttpError("Sign up failed, please try again later", 400, e))
  }

  res.status(201).json({message: "Blog Post created", createdBlog: newBlog})
}

export const getBlogs: RequestHandler = async (req, res, next) => {
  let blogs
  try{
    blogs = await Blog.find()
  }catch(e){
    return next(new HttpError("Blog posts could not be loaded, please try again later.", 500, e))
  }

  if(!blogs){
    return next(new HttpError("Blogs doesn't exist", 404))
  }
  
  res.json({blogs})
}

export const getBlog: RequestHandler = async (req, res, next) => {
  const id = req.params.id

  let blog
  try{
    blog = await Blog.findById(id)
  }catch(e){
    return next(new HttpError("Blog post could not be loaded, please try again later", 500, e))
  }

  if(!blog){
    return next(new HttpError("Blog does not exist", 404))
  }

  res.json({blog})
}

export const editBlog: RequestHandler = async (req, res, next) => {
  const id = req.params.id

  const {description, image} = req.body

  let blog
  try{
    blog = await Blog.updateOne({_id: id}, {$set: {description, image}})
  }catch(e){
    return next(new HttpError("Update failed, try again later"))
  }

  res.json({blog})
}

export const deleteBlog: RequestHandler = async (req, res, next) => {
  const id = req.params.id

  let blog
  try{
    blog = await Blog.deleteOne({_id: id})
  }catch(e){
    return next(new HttpError("Delete Failed, try again later"))
  }

  res.json({blog})
}