"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.editBlog = exports.getBlog = exports.getBlogs = exports.createBlog = void 0;
const blog_1 = __importDefault(require("../models/blog"));
const http_error_1 = __importDefault(require("../models/http-error"));
const createBlog = async (req, res, next) => {
    const { description, image } = req.body;
    const author = "Reian";
    const newBlog = new blog_1.default({
        author, description, image
    });
    try {
        await newBlog.save();
    }
    catch (e) {
        return next(new http_error_1.default("Sign up failed, please try again later", 400, e));
    }
    res.status(201).json({ message: "Blog Post created", createdBlog: newBlog });
};
exports.createBlog = createBlog;
const getBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await blog_1.default.find();
    }
    catch (e) {
        return next(new http_error_1.default("Blog posts could not be loaded, please try again later.", 500, e));
    }
    if (!blogs) {
        return next(new http_error_1.default("Blogs doesn't exist", 404));
    }
    res.json({ blogs });
};
exports.getBlogs = getBlogs;
const getBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await blog_1.default.findById(id);
    }
    catch (e) {
        return next(new http_error_1.default("Blog post could not be loaded, please try again later", 500, e));
    }
    if (!blog) {
        return next(new http_error_1.default("Blog does not exist", 404));
    }
    res.json({ blog });
};
exports.getBlog = getBlog;
const editBlog = async (req, res, next) => {
    const id = req.params.id;
    const { description, image } = req.body;
    let blog;
    try {
        blog = await blog_1.default.updateOne({ _id: id }, { $set: { description, image } });
    }
    catch (e) {
        return next(new http_error_1.default("Update failed, try again later"));
    }
    res.json({ blog });
};
exports.editBlog = editBlog;
const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await blog_1.default.deleteOne({ _id: id });
    }
    catch (e) {
        return next(new http_error_1.default("Delete Failed, try again later"));
    }
    res.json({ blog });
};
exports.deleteBlog = deleteBlog;
