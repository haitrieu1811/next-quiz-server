import { ParamSchema, checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';

import { QuizLevel } from '~/constants/enum';
import { QUIZZES_MESSAGES } from '~/constants/messages';
import databaseService from '~/services/database.services';
import { numberEnumToArray } from '~/utils/common';
import { validate } from '~/utils/validation';

const quizLevels = numberEnumToArray(QuizLevel);

// Tên quiz
const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUIZZES_MESSAGES.QUIZ_NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: QUIZZES_MESSAGES.QUIZ_NAME_MUST_BE_A_STRING
  },
  custom: {
    options: async (value: string) => {
      const quiz = await databaseService.quizzes.findOne({ name: value });
      if (quiz) {
        throw new Error(QUIZZES_MESSAGES.QUIZ_NAME_IS_EXISTED);
      }
      return true;
    }
  },
  trim: true
};

// Level quiz
const levelSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUIZZES_MESSAGES.QUIZ_LEVEL_IS_REQUIRED
  },
  isIn: {
    options: [quizLevels],
    errorMessage: QUIZZES_MESSAGES.QUIZ_LEVEL_IS_INVALID
  }
};

// Topic quiz
const topicSchema: ParamSchema = {
  optional: true,
  custom: {
    options: async (value: string) => {
      if (value && !ObjectId.isValid(value)) {
        throw new Error(QUIZZES_MESSAGES.QUIZ_TOPIC_IS_INVALID);
      }
      const topic = await databaseService.topics.findOne({ _id: new ObjectId(value) });
      if (!topic) {
        throw new Error(QUIZZES_MESSAGES.QUIZ_TOPIC_NOT_EXISTED);
      }
      return true;
    }
  }
};

// Mô tả quiz
const descriptionSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: QUIZZES_MESSAGES.QUIZ_DESCRIPTION_MUST_BE_A_STRING
  },
  trim: true
};

// Tạo quiz mới
export const createQuizValidate = validate(
  checkSchema(
    {
      name: nameSchema,
      level: levelSchema,
      topic: topicSchema,
      description: descriptionSchema
    },
    ['body']
  )
);

// Lấy danh sách quiz
export const getQuizzesValidate = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: {
          errorMessage: QUIZZES_MESSAGES.QUIZ_NAME_MUST_BE_A_STRING
        },
        trim: true
      },
      level: {
        optional: true,
        isIn: {
          options: [quizLevels],
          errorMessage: QUIZZES_MESSAGES.QUIZ_LEVEL_IS_INVALID
        }
      },
      topic: {
        optional: true,
        custom: {
          options: async (value: string) => {
            if (value && !ObjectId.isValid(value)) {
              throw new Error(QUIZZES_MESSAGES.QUIZ_TOPIC_IS_INVALID);
            }
            const topic = await databaseService.topics.findOne({ _id: new ObjectId(value) });
            if (!topic) {
              throw new Error(QUIZZES_MESSAGES.QUIZ_TOPIC_NOT_EXISTED);
            }
            return true;
          }
        }
      }
    },
    ['query']
  )
);

// Cập nhật thông tin một quiz
export const updateQuizValidate = validate(
  checkSchema(
    {
      name: {
        ...nameSchema,
        optional: true,
        notEmpty: undefined
      },
      level: {
        ...levelSchema,
        optional: true,
        notEmpty: undefined
      },
      topic: topicSchema,
      description: descriptionSchema
    },
    ['body']
  )
);

// Kiểm tra quiz id
export const quizIdValidate = validate(
  checkSchema(
    {
      quiz_id: {
        notEmpty: {
          errorMessage: QUIZZES_MESSAGES.QUIZ_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: QUIZZES_MESSAGES.QUIZ_ID_MUST_BE_A_STRING
        },
        custom: {
          options: async (value: string) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(QUIZZES_MESSAGES.QUIZ_ID_IS_INVALID);
            }
            const quiz = await databaseService.quizzes.findOne({ _id: new ObjectId(value) });
            if (!quiz) {
              throw new Error(QUIZZES_MESSAGES.QUIZ_NOT_EXISTED);
            }
            return true;
          }
        },
        trim: true
      }
    },
    ['params']
  )
);

// Xoá quiz (một hoặc nhiều)
export const deleteQuizzesValidate = validate(
  checkSchema(
    {
      quiz_ids: {
        notEmpty: {
          errorMessage: QUIZZES_MESSAGES.QUIZ_IDS_IS_REQUIRED
        },
        isArray: {
          errorMessage: QUIZZES_MESSAGES.QUIZ_IDS_MUST_BE_AN_ARRAY
        },
        custom: {
          options: async (value: string[]) => {
            if (value.length === 0) {
              throw new Error(QUIZZES_MESSAGES.QUIZ_IDS_IS_NOT_EMPTY);
            }
            if (value.some((quiz_id) => !ObjectId.isValid(quiz_id))) {
              throw new Error(QUIZZES_MESSAGES.QUIZ_IDS_IS_INVALID);
            }
            const quizzes = await databaseService.quizzes
              .find({
                _id: {
                  $in: value.map((quiz_id) => new ObjectId(quiz_id))
                }
              })
              .toArray();
            if (quizzes.length !== value.length) {
              throw new Error(QUIZZES_MESSAGES.QUIZ_NOT_EXISTED);
            }
            return true;
          }
        }
      }
    },
    ['body']
  )
);
