import { RequestHandler } from "express"
import fs from "fs"
import Blog from "../models/blog"
import HttpError from "../models/http-error"

const deleteFile = (filePath:any) => {
  fs.unlink(filePath, (err) => {
    if(err){
      throw new Error(err.message)
    }
  })
}

export const createBlog:RequestHandler = async (req, res, next) => {
  const {description, tags} = req.body
  const author = "Reian"
  const image = req.file

  if(!image){
    return next(new HttpError("Attached file is not an image"))
  }

  const imageUrl = image.path;

  const newBlog = new Blog({
    author, description, imageUrl, tags
  })

  try{
    await newBlog.save()
  }catch(e){
    return next(new HttpError("Sign up failed, please try again later", 400, e))
  }

  res.status(201).json({message: "Blog Post created", createdBlog: newBlog})
}

export const getBlogs: RequestHandler = async (req, res, next) => {
  const {filter, exclude} = req.query
  let blogs
  try{
    const conditions:any = {$ne: exclude}
    if(filter) conditions.$eq = filter
    if(exclude) conditions.$ne = exclude
    blogs = await Blog.find({tags: conditions})
  }catch(e){
    return next(new HttpError("Blog posts could not be loaded, please try again later.", 500, e))
  }

  if(!blogs){
    return next(new HttpError("Blogs doesn't exist", 404))
  }
  
  res.status(201).json({blogs})
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

  res.status(201).json({blog})
}

export const editBlog: RequestHandler = async (req, res, next) => {
  const id = req.params.id
  const newImageFile = req.file

  if(!newImageFile){
    return next(new HttpError("Attached file is not an image"))
  }

  const newImageUrl = newImageFile.path

  let oldBlog
  try{
    oldBlog = await Blog.findById(id)
  }catch(e){
    return next(new HttpError("Blog ID doesn't exists"))
  }

  const oldImageUrl = oldBlog?.imageUrl
  if(typeof oldImageUrl !== "undefined"){
    deleteFile(oldImageUrl)
  }

  const {description} = req.body

  let blog
  try{
    blog = await Blog.updateOne({_id: id}, {$set: {description, imageUrl: newImageUrl}})
  }catch(e){
    return next(new HttpError("Update failed, try again later"))
  }

  res.status(201).json({blog})
}

export const deleteBlog: RequestHandler = async (req, res, next) => {
  const id = req.params.id

  let blog
  try{
    blog = await Blog.findById(id)
  }catch(e){
    return next(new HttpError("Delete failed, id not found", 404, e))
  }

  try{
    await Blog.deleteOne({_id: id})
  }catch(e){
    return next(new HttpError("Delete Failed, try again later"))
  }

  const imageUrl = blog?.imageUrl
  if(typeof imageUrl !== "undefined"){
    deleteFile(imageUrl)
  }

  res.status(201).json({message: "Success!"})
}