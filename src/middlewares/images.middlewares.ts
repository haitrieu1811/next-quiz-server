import { checkSchema } from 'express-validator';
import { ObjectId } from 'mongodb';

import HTTP_STATUS from '~/constants/httpStatus';
import { IMAGES_MESSAGES } from '~/constants/messages';
import { ErrorWithStatus } from '~/models/Errors';
import databaseService from '~/services/database.services';
import { validate } from '~/utils/validation';

// Kiểm tra id hình ảnh
export const imageIdValidator = validate(
  checkSchema(
    {
      image_id: {
        trim: true,
        custom: {
          options: async (value: string) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: IMAGES_MESSAGES.IMAGE_ID_IS_REQUIRED,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: IMAGES_MESSAGES.IMAGE_ID_IS_INVALID,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            const image = await databaseService.images.findOne({ _id: new ObjectId(value) });
            if (!image) {
              throw new ErrorWithStatus({
                message: IMAGES_MESSAGES.IMAGE_IS_NOT_EXISTED,
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
