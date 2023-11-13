import { ObjectId } from 'mongodb';
import { QuizLevel } from '~/constants/enum';

interface QuizConstructor {
  _id?: ObjectId;
  user_id: ObjectId;
  name: string;
  thumbnail?: ObjectId;
  level: QuizLevel;
  topic_id?: ObjectId;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export default class Quiz {
  _id?: ObjectId;
  user_id: ObjectId;
  name: string;
  thumbnail: ObjectId | null;
  level: QuizLevel;
  topic_id: ObjectId | null;
  description: string;
  created_at: Date;
  updated_at: Date;

  constructor({
    _id,
    user_id,
    name,
    thumbnail,
    level,
    topic_id,
    description,
    created_at,
    updated_at
  }: QuizConstructor) {
    const date = new Date();
    this._id = _id;
    this.user_id = user_id;
    this.name = name;
    this.thumbnail = thumbnail || null;
    this.level = level;
    this.topic_id = topic_id || null;
    this.description = description || '';
    this.created_at = created_at || date;
    this.updated_at = updated_at || date;
  }
}
