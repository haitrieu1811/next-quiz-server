import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { QUESTIONS_MESSAGES } from '~/constants/messages';

import { CreateQuestionReqBody } from '~/models/requests/Question.requests';
import questionsService from '~/services/questions.services';

// Tạo câu hỏi
export const createQuestionController = async (
  req: Request<ParamsDictionary, any, CreateQuestionReqBody>,
  res: Response
) => {
  const { question } = await questionsService.createQuestion(req.body);
  return res.json({
    message: QUESTIONS_MESSAGES.CREATE_QUESTION_SUCCESSFULLY,
    data: {
      question
    }
  });
};
