import { ParamsDictionary } from 'express-serve-static-core';

import { Answer } from '../schemas/Question.schema';

// Body: Tạo câu hỏi
export interface CreateQuestionReqBody {
  quiz_id: string;
  user_id: string;
  name: string;
  description?: string;
  images?: string[];
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

// Params: Xóa hình ảnh của câu hỏi
export interface DeleteImageOfQuestionReqParams extends QuestionIdReqParams {
  image_id: string;
}
