import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { QUESTIONS_MESSAGES } from '~/constants/messages';
import { PaginationReqQuery } from '~/models/requests/Common.requests';
import {
  CreateQuestionReqBody,
  DeleteQuestionsReqBody,
  QuestionIdReqParams
} from '~/models/requests/Question.requests';
import { QuizIdReqParams } from '~/models/requests/Quiz.requests';
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

// Lấy danh sách câu hỏi theo id của bài quiz
export const getQuestionsByQuizIdController = async (
  req: Request<QuizIdReqParams, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { quiz_id } = req.params;
  const { questions, ...pagination } = await questionsService.getQuestionsByQuizId({
    quizId: quiz_id,
    query: req.query
  });
  return res.json({
    message: QUESTIONS_MESSAGES.GET_QUESTIONS_SUCCESSFULLY,
    data: {
      questions,
      pagination
    }
  });
};

// Cập nhật câu hỏi
export const updateQuestionController = async (
  req: Request<QuestionIdReqParams, any, CreateQuestionReqBody>,
  res: Response
) => {
  const { question_id } = req.params;
  const { question } = await questionsService.updateQuestion({
    questionId: question_id,
    body: req.body
  });
  return res.json({
    message: QUESTIONS_MESSAGES.UPDATE_QUESTION_SUCCESSFULLY,
    data: {
      question
    }
  });
};

// Xoá câu hỏi (một hoặc nhiều)
export const deleteQuestionsController = async (
  req: Request<ParamsDictionary, any, DeleteQuestionsReqBody>,
  res: Response
) => {
  const { question_ids } = req.body;
  const { deletedCount } = await questionsService.deleteQuestions(question_ids);
  return res.json({
    message: `Xoá thành công ${deletedCount} câu hỏi`
  });
};

// Lấy thông tin câu hỏi
export const getQuestionController = async (req: Request<QuestionIdReqParams>, res: Response) => {
  const { question_id } = req.params;
  const { question } = await questionsService.getQuestion(question_id);
  return res.json({
    message: QUESTIONS_MESSAGES.GET_QUESTION_SUCCESSFULLY,
    data: {
      question
    }
  });
};
