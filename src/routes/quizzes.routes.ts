import { Router } from 'express';

import {
  createQuizController,
  deleteQuizController,
  deleteQuizzesController,
  getPublicQuizzesController,
  getQuizController,
  getQuizzesByUserIdController,
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
  filterReqBodyMiddleware<CreateQuizReqBody>(['name', 'description', 'level', 'topic_id', 'thumbnail', 'audience']),
  wrapRequestHandler(createQuizController)
);

// Lấy danh sách các quiz
quizzesRouter.get(
  '/',
  accessTokenValidator,
  adminRoleValidator,
  getQuizzesValidate,
  wrapRequestHandler(getQuizzesController)
);

// Lấy danh sách bài trắc nghiệm public
quizzesRouter.get('/public', getQuizzesValidate, wrapRequestHandler(getPublicQuizzesController));

// Lấy danh sách các bài trắc nghiệm của một user
quizzesRouter.get(
  '/logged-user',
  accessTokenValidator,
  getQuizzesValidate,
  wrapRequestHandler(getQuizzesByUserIdController)
);

// Lấy thông tin một quiz
quizzesRouter.get('/:quiz_id', quizIdValidate, wrapRequestHandler(getQuizController));

// Cập nhật thông tin một quiz
quizzesRouter.patch(
  '/:quiz_id',
  accessTokenValidator,
  quizIdValidate,
  authorQuizValidate,
  updateQuizValidate,
  filterReqBodyMiddleware<CreateQuizReqBody>(['name', 'description', 'level', 'topic_id', 'thumbnail', 'audience']),
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

// Xóa quiz theo id
quizzesRouter.delete(
  '/:quiz_id',
  accessTokenValidator,
  quizIdValidate,
  authorQuizValidate,
  wrapRequestHandler(deleteQuizController)
);

export default quizzesRouter;
