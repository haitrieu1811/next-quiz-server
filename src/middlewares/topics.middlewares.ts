import { ParamSchema, checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from '~/constants/httpStatus';

import { TOPICS_MESSAGES } from '~/constants/messages';
import { ErrorWithStatus } from '~/models/Errors';
import databaseService from '~/services/database.services';
import { validate } from '~/utils/validation';

const nameSchema: ParamSchema = {
  isString: {
    errorMessage: TOPICS_MESSAGES.TOPIC_NAME_MUST_BE_A_STRING
  },
  custom: {
    options: async (value: string) => {
      const topic = await databaseService.topics.findOne({
        name: value
      });
      if (topic) {
        throw new Error(TOPICS_MESSAGES.TOPIC_NAME_ALREADY_EXISTS);
      }
      return true;
    }
  },
  trim: true
};

const descriptionSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: TOPICS_MESSAGES.TOPIC_NAME_MUST_BE_A_STRING
  },
  trim: true
};

// Tạo chủ đề
export const createTopicValidator = validate(
  checkSchema(
    {
      name: {
        ...nameSchema,
        notEmpty: {
          errorMessage: TOPICS_MESSAGES.TOPIC_NAME_IS_REQUIRED
        }
      },
      description: descriptionSchema
    },
    ['body']
  )
);

// Cập nhật chủ đề
export const updateTopicValidator = validate(
  checkSchema(
    {
      name: {
        ...nameSchema,
        optional: true
      },
      description: descriptionSchema
    },
    ['body']
  )
);

// Kiểm tra topic id
export const topicIdValidator = validate(
  checkSchema(
    {
      topic_id: {
        custom: {
          options: async (value: string) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: TOPICS_MESSAGES.TOPIC_ID_IS_REQUIRED,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: TOPICS_MESSAGES.TOPIC_ID_IS_INVALID,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            const topic = await databaseService.topics.findOne({
              _id: new ObjectId(value)
            });
            if (!topic) {
              throw new ErrorWithStatus({
                message: TOPICS_MESSAGES.TOPIC_IS_NOT_EXISTED,
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

// Xóa chủ đề
export const deleteTopicsValidator = validate(
  checkSchema(
    {
      topic_ids: {
        custom: {
          options: async (value: string[]) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: TOPICS_MESSAGES.TOPIC_IDS_IS_REQUIRED,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            if (value.length === 0) {
              throw new ErrorWithStatus({
                message: TOPICS_MESSAGES.TOPIC_IDS_IS_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            if (value.some((topic_id) => !ObjectId.isValid(topic_id))) {
              throw new ErrorWithStatus({
                message: TOPICS_MESSAGES.TOPIC_IDS_IS_INVALID,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            const topics = await databaseService.topics
              .find({
                _id: {
                  $in: value.map((topic_id) => new ObjectId(topic_id))
                }
              })
              .toArray();
            if (topics.length !== value.length) {
              throw new ErrorWithStatus({
                message: TOPICS_MESSAGES.TOPIC_IS_NOT_EXISTED,
                status: HTTP_STATUS.NOT_FOUND
              });
            }
            return true;
          }
        }
      }
    },
    ['body']
  )
);
