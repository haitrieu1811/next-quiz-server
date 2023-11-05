import { Router } from 'express';
import { createQuestionController } from '~/controllers/questions.controllers';
import { createQuestionValidator } from '~/middlewares/questions.middlewares';

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

export default questionsRouter;
