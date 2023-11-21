import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { QUIZZES_MESSAGES } from '~/constants/messages';
import {
  CreateQuizReqBody,
  DeleteQuizzesReqBody,
  GetQuizzesReqQuery,
  QuizIdReqParams,
  UpdateQuizReqBody
} from '~/models/requests/Quiz.requests';
import { TokenPayload } from '~/models/requests/User.requests';
import quizzesService from '~/services/quizzes.services';

// Tạo một quiz mới
export const createQuizController = async (req: Request<ParamsDictionary, any, CreateQuizReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const { quiz } = await quizzesService.createQuiz({ body: req.body, user_id });
  return res.json({
    messsage: QUIZZES_MESSAGES.CREATE_QUIZ_SUCCESSFULLY,
    data: {
      quiz
    }
  });
};

// Lấy danh sách các quiz
export const getQuizzesController = async (
  req: Request<ParamsDictionary, any, any, GetQuizzesReqQuery>,
  res: Response
) => {
  const { quizzes, ...pagination } = await quizzesService.getQuizzes(req.query);
  return res.json({
    messsage: QUIZZES_MESSAGES.GET_QUIZZES_SUCCESSFULLY,
    data: {
      quizzes,
      pagination
    }
  });
};

// Lấy thông tin một quiz
export const getQuizController = async (req: Request<QuizIdReqParams>, res: Response) => {
  const { quiz_id } = req.params;
  const { quiz } = await quizzesService.getQuiz(quiz_id);
  return res.json({
    messsage: QUIZZES_MESSAGES.GET_QUIZ_SUCCESSFULLY,
    data: {
      quiz
    }
  });
};

// Cập nhật thông tin một quiz
export const updateQuizController = async (req: Request<ParamsDictionary, any, UpdateQuizReqBody>, res: Response) => {
  const { quiz_id } = req.params;
  const { body } = req;
  const { quiz } = await quizzesService.updateQuiz({ quiz_id, body });
  return res.json({
    messsage: QUIZZES_MESSAGES.UPDATE_QUIZ_SUCCESSFULLY,
    data: {
      quiz
    }
  });
};

// Xoá quiz (một hoặc nhiều)
export const deleteQuizzesController = async (
  req: Request<ParamsDictionary, any, DeleteQuizzesReqBody>,
  res: Response
) => {
  const { quiz_ids } = req.body;
  const { deletedCount } = await quizzesService.deleteQuizzes(quiz_ids);
  return res.json({
    messsage: `Đã xoá ${deletedCount} quiz`
  });
};

// Xóa quiz theo id
export const deleteQuizController = async (req: Request<QuizIdReqParams>, res: Response) => {
  const { quiz_id } = req.params;
  await quizzesService.deleteQuiz(quiz_id);
  return res.json({
    messsage: QUIZZES_MESSAGES.DELETE_QUIZ_SUCCESSFULLY
  });
};

// Lấy danh sách các bài trắc nghiệm public
export const getPublicQuizzesController = async (
  req: Request<ParamsDictionary, any, any, GetQuizzesReqQuery>,
  res: Response
) => {
  const { quizzes, ...pagination } = await quizzesService.getPublicQuizzes(req.query);
  return res.json({
    messsage: QUIZZES_MESSAGES.GET_QUIZZES_SUCCESSFULLY,
    data: {
      quizzes,
      pagination
    }
  });
};
