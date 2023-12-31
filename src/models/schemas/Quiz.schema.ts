import { ObjectId } from 'mongodb';
import { QuizAudience, QuizLevel } from '~/constants/enum';

interface QuizConstructor {
  _id?: ObjectId;
  user_id: ObjectId;
  topic_id: ObjectId;
  name: string;
  thumbnail?: ObjectId;
  description?: string;
  level: QuizLevel;
  audience?: QuizAudience;
  created_at?: Date;
  updated_at?: Date;
}

export default class Quiz {
  _id?: ObjectId;
  user_id: ObjectId;
  topic_id: ObjectId;
  name: string;
  thumbnail: ObjectId | null;
  description: string;
  level: QuizLevel;
  audience?: QuizAudience;
  created_at: Date;
  updated_at: Date;

  constructor({
    _id,
    user_id,
    name,
    thumbnail,
    description,
    level,
    topic_id,
    audience,
    created_at,
    updated_at
  }: QuizConstructor) {
    const date = new Date();
    this._id = _id;
    this.user_id = user_id;
    this.name = name;
    this.thumbnail = thumbnail || null;
    this.description = description || '';
    this.level = level;
    this.topic_id = topic_id || null;
    this.audience = audience || QuizAudience.Everyone;
    this.created_at = created_at || date;
    this.updated_at = updated_at || date;
  }
}
