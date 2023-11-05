import { ObjectId } from 'mongodb';
import { QuizLevel } from '~/constants/enum';

interface QuizConstructor {
  _id?: ObjectId;
  name: string;
  thumbnail?: ObjectId;
  level: QuizLevel;
  topic?: ObjectId;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export default class Quiz {
  _id?: ObjectId;
  name: string;
  thumbnail: ObjectId | null;
  level: QuizLevel;
  topic: ObjectId | null;
  description: string;
  created_at: Date;
  updated_at: Date;

  constructor({ _id, name, thumbnail, level, topic, description, created_at, updated_at }: QuizConstructor) {
    const date = new Date();
    this._id = _id;
    this.name = name;
    this.thumbnail = thumbnail || null;
    this.level = level;
    this.topic = topic || null;
    this.description = description || '';
    this.created_at = created_at || date;
    this.updated_at = updated_at || date;
  }
}
