import { Request } from 'express';
import { checkSchema, ParamSchema } from 'express-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import capitalize from 'lodash/capitalize';

import { ENV_CONFIG } from '~/constants/config';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/messages';
import { ErrorWithStatus } from '~/models/Errors';
import databaseService from '~/services/database.services';
import { hashPassword } from '~/utils/crypto';
import { verifyToken } from '~/utils/jwt';
import { validate } from '~/utils/validation';

const emailSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.EMAIL_MUST_BE_A_STRING
  },
  isEmail: {
    errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
  }
};

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_IS_INVALID,
    options: {
      min: 8,
      max: 32
    }
  },
  isStrongPassword: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_WEAK,
    options: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }
  }
};

// Kiểm tra access token có hợp lệ hay không
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1];
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              });
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: ENV_CONFIG.JWT_SECRET_ACCESS_TOKEN
              });
              (req as Request).decoded_authorization = decoded_authorization;
              return true;
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              });
            }
          }
        }
      }
    },
    ['headers']
  )
);

// Kiểm tra refresh token có hợp lệ hay không
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              });
            }
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: ENV_CONFIG.JWT_SECRET_REFRESH_TOKEN }),
                databaseService.refresh_tokens.findOne({ token: value })
              ]);
              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                });
              }
              (req as Request).decoded_refresh_token = decoded_refresh_token;
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED
                });
              }
              throw error;
            }
            return true;
          }
        }
      }
    },
    ['body']
  )
);

// Kiểm tra dữ liệu đăng ký
export const registerValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string) => {
            const user = await databaseService.users.findOne({ email: value });
            if (user) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS);
            }
            return true;
          }
        }
      },
      password: passwordSchema,
      confirm_password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
        },
        custom: {
          options: (value: string, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH);
            }
            return true;
          }
        }
      }
    },
    ['body']
  )
);

// Kiểm tra dữ liệu đăng nhập
export const loginValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string) => {
            const user = await databaseService.users.findOne({ email: value });
            if (!user) {
              throw new Error(USERS_MESSAGES.EMAIL_NOT_EXIST);
            }
            return true;
          }
        }
      },
      password: {
        ...passwordSchema,
        custom: {
          options: async (value: string, { req }) => {
            const { email } = req.body;
            const user = await databaseService.users.findOne(
              {
                email,
                password: hashPassword(value)
              },
              {
                projection: {
                  password: 0,
                  role: 0,
                  status: 0,
                  forgot_password_token: 0
                }
              }
            );
            if (!user) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT);
            }
            (req as Request).user = user;
            return true;
          }
        }
      }
    },
    ['body']
  )
);
