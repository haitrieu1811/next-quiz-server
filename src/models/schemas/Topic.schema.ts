import { ObjectId } from 'mongodb';

interface TopicConstructor {
  _id?: ObjectId;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export default class Topic {
  _id?: ObjectId;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;

  constructor({ _id, name, description, created_at, updated_at }: TopicConstructor) {
    const date = new Date();
    this._id = _id;
    this.name = name;
    this.description = description || '';
    this.created_at = created_at || date;
    this.updated_at = updated_at || date;
  }
}
