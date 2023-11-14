import { Router } from 'express';

import {
  createQuizController,
  deleteQuizzesController,
  getQuizController,
  getQuizzesController,
  updateQuizController
} from '~/controllers/quizzes.controllers';
import {
  authorQuizValidate,
  createQuizValidate,
  deleteQuizzesValidate,
  getQuizzesValidate,
  quizIdValidate,
  updateQuizValidate
} from '~/middlewares/quizzes.middlewares';
import { accessTokenValidator, adminRoleValidator } from '~/middlewares/users.middlewares';
import { CreateQuizReqBody } from '~/models/requests/Quiz.requests';
import { filterReqBodyMiddleware, wrapRequestHandler } from '~/utils/handler';

const quizzesRouter = Router();

// Tạo một quiz mới
quizzesRouter.post(
  '/',
  accessTokenValidator,
  createQuizValidate,
  filterReqBodyMiddleware<CreateQuizReqBody>(['name', 'description', 'level', 'topic_id', 'thumbnail']),
  wrapRequestHandler(createQuizController)
);

// Lấy danh sách các quiz
quizzesRouter.get('/', getQuizzesValidate, wrapRequestHandler(getQuizzesController));

// Lấy thông tin một quiz
quizzesRouter.get('/:quiz_id', quizIdValidate, wrapRequestHandler(getQuizController));

// Cập nhật thông tin một quiz
quizzesRouter.patch(
  '/:quiz_id',
  accessTokenValidator,
  quizIdValidate,
  authorQuizValidate,
  updateQuizValidate,
  filterReqBodyMiddleware<CreateQuizReqBody>(['name', 'description', 'level', 'topic_id', 'thumbnail']),
  wrapRequestHandler(updateQuizController)
);

// Xoá quiz (một hoặc nhiều)
quizzesRouter.delete(
  '/',
  accessTokenValidator,
  adminRoleValidator,
  deleteQuizzesValidate,
  wrapRequestHandler(deleteQuizzesController)
);

export default quizzesRouter;
