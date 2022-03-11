import {Document} from 'mongoose'

export interface Blog{
  author: string;
  description: string;
  imageUrl: string;
  tag: string[];
}

export default interface BlogDoc extends Document, Blog {}