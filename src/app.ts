import { json } from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import blogRouter from "./routes/blog";

const app = express();

app.use(json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use("/", blogRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

// app.listen(process.env.PORT || 5000)

mongoose.connect(
  // #note that if this project is to be used in production stage, the username and password should be stored in a .env file and should be accessed as an Environment Variable.
  `mongodb+srv://redcoreblog:blogforredcore@redcore-blog.mruj7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
).then(()=>{
  app.listen(process.env.PORT || 5000)
}).catch(err => {console.log(err)});
