import { ParamsDictionary } from 'express-serve-static-core';

import { QuizLevel, QuizAudience } from '~/constants/enum';
import { PaginationReqQuery } from './Common.requests';

// Body: Tạo một quiz mới
export interface CreateQuizReqBody {
  name: string;
  level: QuizLevel;
  topic_id: string;
  description?: string;
  thumbnail?: string;
  audience?: QuizAudience;
}

// Query: Lấy danh sách quiz
export interface GetQuizzesReqQuery extends PaginationReqQuery {
  name?: string;
  level?: QuizLevel;
  topic?: string;
  user_id?: string;
  audience?: QuizAudience;
}

// Body: Cập nhật thông tin một quiz
export interface UpdateQuizReqBody {
  name?: string;
  level?: QuizLevel;
  topic_id?: string;
  description?: string;
  thumbnail?: string;
  audience?: QuizAudience;
}

// Params: Quiz id
export interface QuizIdReqParams extends ParamsDictionary {
  quiz_id: string;
}

// Body: Xoá quiz (một hoặc nhiều)
export interface DeleteQuizzesReqBody {
  quiz_ids: string[];
}
