import { json } from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import blogRouter from "./routes/blog";

// multer is for uploading files
import multer from 'multer'

// saves the file in the back-end directory
const fileStorage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'uploads/images/')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
  }
})

// filters out non-image file types
const fileFilter = (req: any, file: any, cb: any) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null, true)
  }else{
    cb(null, false)
  }
}

const app = express();

app.use(json())
app.use(multer({storage: fileStorage, fileFilter}).single('image'))

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use("/", blogRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

// app.listen(process.env.PORT || 5000)

mongoose.connect(
  // #note that if this project is to be used in app's stage, the username and password should be stored in a .env file and should be accessed as an Environment Variable.
  `mongodb+srv://redcoreblog:blogforredcore@redcore-blog.mruj7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
).then(()=>{
  app.listen(process.env.PORT || 5000)
}).catch(err => {console.log(err)});
