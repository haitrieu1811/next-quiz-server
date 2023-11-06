import { ObjectId } from 'mongodb';
import { ParamsDictionary } from 'express-serve-static-core';

import { Answer } from '../schemas/Question.schema';

// Body: Tạo câu hỏi
export interface CreateQuestionReqBody {
  quiz_id: ObjectId;
  name: string;
  description?: string;
  images?: ObjectId[];
  answers: Answer[];
}

// Params: Question id
export interface QuestionIdReqParams extends ParamsDictionary {
  question_id: string;
}

// Body: Xóa câu hỏi (một hoặc nhiều)
export interface DeleteQuestionsReqBody {
  question_ids: string[];
}
