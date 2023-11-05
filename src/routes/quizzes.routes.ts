import { Router } from 'express';

import {
  createQuizController,
  deleteQuizzesController,
  getQuizzesController,
  updateQuizController
} from '~/controllers/quizzes.controllers';
import {
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
  adminRoleValidator,
  createQuizValidate,
  filterReqBodyMiddleware<CreateQuizReqBody>(['name', 'description', 'level', 'topic']),
  wrapRequestHandler(createQuizController)
);

// Lấy danh sách các quiz
quizzesRouter.get('/', getQuizzesValidate, wrapRequestHandler(getQuizzesController));

// Cập nhật thông tin một quiz
quizzesRouter.patch(
  '/:quiz_id',
  accessTokenValidator,
  adminRoleValidator,
  quizIdValidate,
  updateQuizValidate,
  filterReqBodyMiddleware<CreateQuizReqBody>(['name', 'description', 'level', 'topic']),
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
