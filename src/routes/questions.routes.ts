import { Router } from 'express';

import {
  createQuestionController,
  deleteQuestionsController,
  getQuestionController,
  getQuestionsByQuizIdController,
  updateQuestionController
} from '~/controllers/questions.controllers';
import { paginationValidator } from '~/middlewares/common.middlewares';
import {
  createQuestionValidator,
  deleteQuestionsValidator,
  questionIdValidate
} from '~/middlewares/questions.middlewares';
import { quizIdValidate } from '~/middlewares/quizzes.middlewares';
import { accessTokenValidator, adminRoleValidator } from '~/middlewares/users.middlewares';
import { CreateQuestionReqBody } from '~/models/requests/Question.requests';
import { filterReqBodyMiddleware, wrapRequestHandler } from '~/utils/handler';

const questionsRouter = Router();

// Tạo câu hỏi
questionsRouter.post(
  '/',
  accessTokenValidator,
  adminRoleValidator,
  createQuestionValidator,
  filterReqBodyMiddleware<CreateQuestionReqBody>(['quiz_id', 'name', 'description', 'images', 'answers']),
  wrapRequestHandler(createQuestionController)
);

// Lấy danh sách câu hỏi theo id của bài quiz
questionsRouter.get(
  '/quiz/:quiz_id',
  accessTokenValidator,
  quizIdValidate,
  paginationValidator,
  wrapRequestHandler(getQuestionsByQuizIdController)
);

// Cập nhật câu hỏi
questionsRouter.put(
  '/:question_id',
  accessTokenValidator,
  adminRoleValidator,
  questionIdValidate,
  createQuestionValidator,
  filterReqBodyMiddleware<CreateQuestionReqBody>(['quiz_id', 'name', 'description', 'images', 'answers']),
  wrapRequestHandler(updateQuestionController)
);

// Xóa câu hỏi (một hoặc nhiều)
questionsRouter.delete(
  '/',
  accessTokenValidator,
  adminRoleValidator,
  deleteQuestionsValidator,
  wrapRequestHandler(deleteQuestionsController)
);

// Lấy thông tin câu hỏi
questionsRouter.get(
  '/:question_id',
  accessTokenValidator,
  questionIdValidate,
  wrapRequestHandler(getQuestionController)
);

export default questionsRouter;
