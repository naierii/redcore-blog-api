"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const blog_1 = __importDefault(require("./routes/blog"));
// multer is for uploading files
const multer_1 = __importDefault(require("multer"));
// saves the file in the back-end directory
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});
// filters out non-image file types
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use((0, multer_1.default)({ storage: fileStorage, fileFilter }).single('image'));
app.use('/uploads/images', express_1.default.static(path_1.default.join('uploads', 'images')));
app.use("/", blog_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
// app.listen(process.env.PORT || 5000)
mongoose_1.default.connect(
// #note that if this project is to be used in app's stage, the username and password should be stored in a .env file and should be accessed as an Environment Variable.
`mongodb+srv://redcoreblog:blogforredcore@redcore-blog.mruj7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`).then(() => {
    app.listen(process.env.PORT || 5000);
}).catch(err => { console.log(err); });
