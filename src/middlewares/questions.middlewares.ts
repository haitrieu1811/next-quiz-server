import { checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';

import { QUESTIONS_MESSAGES, QUIZZES_MESSAGES } from '~/constants/messages';
import { Answer } from '~/models/schemas/Question.schema';
import databaseService from '~/services/database.services';
import { validate } from '~/utils/validation';

// Tạo câu hỏi
export const createQuestionValidator = validate(
  checkSchema(
    {
      quiz_id: {
        notEmpty: {
          errorMessage: QUIZZES_MESSAGES.QUIZ_ID_IS_REQUIRED
        },
        isMongoId: {
          errorMessage: QUIZZES_MESSAGES.QUIZ_ID_IS_INVALID
        },
        custom: {
          options: async (value: string) => {
            const quiz = await databaseService.quizzes.findOne({ _id: new ObjectId(value) });
            if (!quiz) {
              throw new Error(QUIZZES_MESSAGES.QUIZ_IS_NOT_EXISTED);
            }
          }
        }
      },
      name: {
        notEmpty: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_NAME_MUST_BE_A_STRING
        },
        trim: true
      },
      description: {
        optional: true,
        isString: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_DESCRIPTION_MUST_BE_A_STRING
        },
        trim: true
      },
      images: {
        optional: true,
        isArray: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_IMAGES_MUST_BE_AN_ARRAY
        },
        custom: {
          options: async (value: string[]) => {
            if (value.length === 0) {
              throw new Error(QUESTIONS_MESSAGES.QUESTION_IMAGES_MUST_NOT_BE_EMPTY);
            }
            const isValid = value.every((item) => ObjectId.isValid(item));
            if (!isValid) {
              throw new Error(QUESTIONS_MESSAGES.QUESTION_IMAGES_IS_INVALID);
            }
            return true;
          }
        }
      },
      answers: {
        notEmpty: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_ANSWERS_IS_REQUIRED
        },
        isArray: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_ANSWERS_MUST_BE_AN_ARRAY
        },
        custom: {
          options: (value: Answer[]) => {
            const isValid = value.every((item) => {
              if (
                (item.name && typeof item.name !== 'string') ||
                (item.description && typeof item.description !== 'string') ||
                typeof item.is_correct !== 'boolean'
              ) {
                return false;
              }
              return true;
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
      }
    },
    ['body']
  )
);
