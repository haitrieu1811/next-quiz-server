import { ObjectId } from 'mongodb';

interface ImageConstructor {
  _id?: ObjectId;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export default class Image {
  _id?: ObjectId;
  name: string;
  created_at: Date;
  updated_at: Date;

  constructor({ _id, name, created_at, updated_at }: ImageConstructor) {
    const date = new Date();
    this._id = _id;
    this.name = name;
    this.created_at = created_at || date;
    this.updated_at = updated_at || date;
  }
}
