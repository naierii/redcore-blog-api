"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.editBlog = exports.getBlog = exports.getBlogs = exports.createBlog = void 0;
const fs_1 = __importDefault(require("fs"));
const blog_1 = __importDefault(require("../models/blog"));
const http_error_1 = __importDefault(require("../models/http-error"));
const deleteFile = (filePath) => {
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            throw new Error(err.message);
        }
    });
};
const createBlog = async (req, res, next) => {
    const { description, tags } = req.body;
    const author = "Reian";
    const image = req.file;
    if (!image) {
        return next(new http_error_1.default("Attached file is not an image"));
    }
    const imageUrl = image.path;
    const newBlog = new blog_1.default({
        author, description, imageUrl, tags
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
    const { filter, exclude } = req.query;
    let blogs;
    try {
        const conditions = { $ne: exclude };
        if (filter)
            conditions.$eq = filter;
        if (exclude)
            conditions.$ne = exclude;
        blogs = await blog_1.default.find({ tags: conditions });
    }
    catch (e) {
        return next(new http_error_1.default("Blog posts could not be loaded, please try again later.", 500, e));
    }
    if (!blogs) {
        return next(new http_error_1.default("Blogs doesn't exist", 404));
    }
    res.status(201).json({ blogs });
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
    res.status(201).json({ blog });
};
exports.getBlog = getBlog;
const editBlog = async (req, res, next) => {
    const id = req.params.id;
    const newImageFile = req.file;
    if (!newImageFile) {
        return next(new http_error_1.default("Attached file is not an image"));
    }
    const newImageUrl = newImageFile.path;
    let oldBlog;
    try {
        oldBlog = await blog_1.default.findById(id);
    }
    catch (e) {
        return next(new http_error_1.default("Blog ID doesn't exists"));
    }
    const oldImageUrl = oldBlog === null || oldBlog === void 0 ? void 0 : oldBlog.imageUrl;
    if (typeof oldImageUrl !== "undefined") {
        deleteFile(oldImageUrl);
    }
    const { description } = req.body;
    let blog;
    try {
        blog = await blog_1.default.updateOne({ _id: id }, { $set: { description, imageUrl: newImageUrl } });
    }
    catch (e) {
        return next(new http_error_1.default("Update failed, try again later"));
    }
    res.status(201).json({ blog });
};
exports.editBlog = editBlog;
const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await blog_1.default.findById(id);
    }
    catch (e) {
        return next(new http_error_1.default("Delete failed, id not found", 404, e));
    }
    try {
        await blog_1.default.deleteOne({ _id: id });
    }
    catch (e) {
        return next(new http_error_1.default("Delete Failed, try again later"));
    }
    const imageUrl = blog === null || blog === void 0 ? void 0 : blog.imageUrl;
    if (typeof imageUrl !== "undefined") {
        deleteFile(imageUrl);
    }
    res.status(201).json({ message: "Success!" });
};
exports.deleteBlog = deleteBlog;
