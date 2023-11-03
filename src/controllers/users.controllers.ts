import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { USERS_MESSAGES } from '~/constants/messages';
import { RegisterReqBody } from '~/models/requests/User.requests';
import usersService from '~/services/users.services';

// Đăng ký
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { user, access_token, refresh_token } = await usersService.register(req.body);
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESSFULLY,
    data: {
      access_token,
      refresh_token,
      user
    }
  });
};
