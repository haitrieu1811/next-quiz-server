import { NextFunction, Request } from 'express';
import { checkSchema } from 'express-validator';
import pick from 'lodash/pick';

import HTTP_STATUS from '~/constants/httpStatus';
import { COMMON_MESSAGES } from '~/constants/messages';
import { ErrorWithStatus } from '~/models/Errors';
import { validate } from '~/utils/validation';

type FilterKeys<T> = Array<keyof T>;

export const filterReqBodyMiddleware =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys);
    next();
  };

export const paginationValidator = validate(
  checkSchema(
    {
      page: {
        optional: true,
        custom: {
          options: (value: number) => {
            if (isNaN(Number(value))) {
              throw new ErrorWithStatus({
                message: COMMON_MESSAGES.PAGE_MUST_BE_A_NUMBER,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            if (value < 1) {
              throw new ErrorWithStatus({
                message: COMMON_MESSAGES.PAGE_MUST_BE_A_POSITIVE_NUMBER,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            return true;
          }
        }
      },
      limit: {
        optional: true,
        custom: {
          options: (value: number) => {
            if (isNaN(Number(value))) {
              throw new ErrorWithStatus({
                message: COMMON_MESSAGES.LIMIT_MUST_BE_A_NUMBER,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            if (value < 1) {
              throw new ErrorWithStatus({
                message: COMMON_MESSAGES.LIMIT_MUST_BE_A_POSITIVE_NUMBER,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            if (value > 100) {
              throw new ErrorWithStatus({
                message: COMMON_MESSAGES.LIMIT_MUST_BE_LESS_THAN_100,
                status: HTTP_STATUS.BAD_REQUEST
              });
            }
            return true;
          }
        }
      }
    },
    ['query']
  )
);
