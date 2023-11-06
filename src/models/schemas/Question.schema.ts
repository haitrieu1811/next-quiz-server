import { ObjectId } from 'mongodb';

export interface Answer {
  _id?: ObjectId;
  name: string;
  description?: string;
  images?: ObjectId[];
  is_correct: boolean;
}

interface QuestionConstructor {
  _id?: ObjectId;
  quiz_id: ObjectId;
  name: string;
  description?: string;
  images?: ObjectId[];
  answers: Answer[];
  created_at?: Date;
  updated_at?: Date;
}

export default class Question {
  _id?: ObjectId;
  quiz_id: ObjectId;
  name: string;
  description: string;
  images: ObjectId[];
  answers: Answer[];
  created_at: Date;
  updated_at: Date;

  constructor({ _id, quiz_id, name, description, images, answers, created_at, updated_at }: QuestionConstructor) {
    const date = new Date();
    this._id = _id;
    this.quiz_id = quiz_id;
    this.name = name;
    this.description = description || '';
    this.images = images || [];
    this.answers = answers;
    this.created_at = created_at || date;
    this.updated_at = updated_at || date;
  }
}
