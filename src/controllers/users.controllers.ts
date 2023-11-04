import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectId } from 'mongodb';

import { USERS_MESSAGES } from '~/constants/messages';
import { LoginReqBody, RegisterReqBody } from '~/models/requests/User.requests';
import User from '~/models/schemas/User.schema';
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

// Đăng nhập
export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User;
  const { access_token, refresh_token } = await usersService.login({
    user_id: (user._id as ObjectId).toString(),
    role: user.role
  });
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESSFULLY,
    data: {
      access_token,
      refresh_token,
      user
    }
  });
};

// Đăng xuất
export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  await usersService.logout(refresh_token);
  return res.json({
    message: USERS_MESSAGES.LOGOUT_SUCCESSFULLY
  });
};
