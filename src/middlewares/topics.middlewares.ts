import { checkSchema } from 'express-validator';
import { TOPICS_MESSAGES } from '~/constants/messages';
import databaseService from '~/services/database.services';
import { validate } from '~/utils/validation';

// Tạo chủ đề
export const createTopicValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: TOPICS_MESSAGES.TOPIC_NAME_IS_REQUIRED
        },
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
      },
      description: {
        optional: true,
        isString: {
          errorMessage: TOPICS_MESSAGES.TOPIC_NAME_MUST_BE_A_STRING
        },
        trim: true
      }
    },
    ['body']
  )
);
