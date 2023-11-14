import { NextFunction, Request, Response } from 'express';
import { ParamSchema, checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';

import HTTP_STATUS from '~/constants/httpStatus';
import { QUESTIONS_MESSAGES, QUIZZES_MESSAGES } from '~/constants/messages';
import { ErrorWithStatus } from '~/models/Errors';
import { QuestionIdReqParams } from '~/models/requests/Question.requests';
import { TokenPayload } from '~/models/requests/User.requests';
import { Answer } from '~/models/schemas/Question.schema';
import databaseService from '~/services/database.services';
import { validate } from '~/utils/validation';

const quizIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUIZZES_MESSAGES.QUIZ_ID_IS_REQUIRED
  },
  isMongoId: {
    errorMessage: QUIZZES_MESSAGES.QUIZ_ID_IS_INVALID
  },
  custom: {
    options: async (value: string, { req }) => {
      const { user_id } = (req as Request).decoded_authorization as TokenPayload;
      const quiz = await databaseService.quizzes.findOne({ _id: new ObjectId(value) });
      if (!quiz) {
        throw new ErrorWithStatus({
          message: QUIZZES_MESSAGES.QUIZ_IS_NOT_EXISTED,
          status: HTTP_STATUS.NOT_FOUND
        });
      }
      if (quiz.user_id.toString() !== user_id) {
        throw new ErrorWithStatus({
          message: QUIZZES_MESSAGES.QUIZ_NOT_AUTHOR,
          status: HTTP_STATUS.FORBIDDEN
        });
      }
      return true;
    }
  }
};

const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_MESSAGES.QUESTION_NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: QUESTIONS_MESSAGES.QUESTION_NAME_MUST_BE_A_STRING
  },
  trim: true
};

const descriptionSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: QUESTIONS_MESSAGES.QUESTION_DESCRIPTION_MUST_BE_A_STRING
  },
  trim: true
};

const imagesSchema: ParamSchema = {
  optional: true,
  isArray: {
    errorMessage: QUESTIONS_MESSAGES.QUESTION_IMAGES_MUST_BE_AN_ARRAY
  },
  custom: {
    options: async (value: string[]) => {
      const isValid = value.every((item) => ObjectId.isValid(item));
      if (!isValid) {
        throw new Error(QUESTIONS_MESSAGES.QUESTION_IMAGES_IS_INVALID);
      }
      return true;
    }
  }
};

const answersSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_MESSAGES.QUESTION_ANSWERS_IS_REQUIRED
  },
  isArray: {
    errorMessage: QUESTIONS_MESSAGES.QUESTION_ANSWERS_MUST_BE_AN_ARRAY
  },
  custom: {
    options: (value: Answer[]) => {
      const expectFields = ['name', 'description', 'is_correct'];
      const isValid = value.every((answer) => {
        const keys = Object.keys(answer);
        for (const key of keys) {
          if (!expectFields.includes(key)) {
            return false;
          }
        }
        if (keys.length !== expectFields.length) {
          return false;
        }
        return typeof answer.name === 'string' && typeof answer.description && typeof answer.is_correct === 'boolean';
      });
      if (!isValid) {
        throw new Error(QUESTIONS_MESSAGES.QUESTION_ANSWERS_IS_INVALID);
      }
      if (value.length < 2) {
        throw new Error(QUESTIONS_MESSAGES.QUESTION_ANSWERS_MUST_HAVE_AT_LEAST_TWO_ANSWERS);
      }
      if (value.length > 6) {
        throw new Error(QUESTIONS_MESSAGES.QUESTION_ANSWERS_MUST_HAVE_AT_MOST_SIX_ANSWERS);
      }
      const correctAnswers = value.filter((answer) => answer.is_correct);
      if (correctAnswers.length !== 1) {
        throw new Error(QUESTIONS_MESSAGES.QUESTION_ANSWERS_MUST_HAVE_ONLY_ONE_CORRECT_ANSWER);
      }
      return true;
    }
  }
};

// Tạo câu hỏi
export const createQuestionValidator = validate(
  checkSchema(
    {
      quiz_id: quizIdSchema,
      name: nameSchema,
      description: descriptionSchema,
      images: imagesSchema,
      answers: answersSchema
    },
    ['body']
  )
);

// Kiểm tra question id
export const questionIdValidate = validate(
  checkSchema(
    {
      question_id: {
        notEmpty: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_ID_IS_REQUIRED
        },
        isMongoId: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_ID_IS_INVALID
        },
        custom: {
          options: async (value: string) => {
            const question = await databaseService.questions.findOne({ _id: new ObjectId(value) });
            if (!question) {
              throw new ErrorWithStatus({
                message: QUESTIONS_MESSAGES.QUESTION_IS_NOT_EXISTED,
                status: HTTP_STATUS.NOT_FOUND
              });
            }
            return true;
          }
        }
      }
    },
    ['params']
  )
);

// Xóa câu hỏi (một hoặc nhiều)
export const deleteQuestionsValidator = validate(
  checkSchema(
    {
      question_ids: {
        notEmpty: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_IDS_IS_REQUIRED
        },
        isArray: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_IDS_MUST_BE_AN_ARRAY
        },
        custom: {
          options: async (value: string[]) => {
            if (value.length === 0) {
              throw new Error(QUESTIONS_MESSAGES.QUESTION_IDS_IS_NOT_EMPTY);
            }
            const isValid = value.every((item) => ObjectId.isValid(item));
            if (!isValid) {
              throw new Error(QUESTIONS_MESSAGES.QUESTION_IDS_IS_INVALID);
            }
            const questions = await databaseService.questions
              .find({ _id: { $in: value.map((item) => new ObjectId(item)) } })
              .toArray();
            if (questions.length !== value.length) {
              throw new Error(QUESTIONS_MESSAGES.QUESTION_IDS_ARE_NOT_EXISTED);
            }
            return true;
          }
        }
      }
    },
    ['body']
  )
);

// Kiểm tra tác giả của câu hỏi
export const questionAuthorValidate = async (req: Request<QuestionIdReqParams>, _: Response, next: NextFunction) => {
  const { question_id } = req.params;
  const { user_id } = (req as Request).decoded_authorization as TokenPayload;
  const question = await databaseService.questions.findOne({
    _id: new ObjectId(question_id),
    user_id: new ObjectId(user_id)
  });
  if (!question) {
    return next(
      new ErrorWithStatus({
        message: QUESTIONS_MESSAGES.QUESTION_NOT_AUTHOR,
        status: HTTP_STATUS.FORBIDDEN
      })
    );
  }
  return next();
};
