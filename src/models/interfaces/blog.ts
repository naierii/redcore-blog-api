import {Document} from 'mongoose'

interface Blog{
  author: string;
  description: string;
  image: string;
}

export default interface BlogDoc extends Document, Blog {}