import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectId } from 'mongodb';

import { USERS_MESSAGES } from '~/constants/messages';
import { LoginReqBody, LogoutReqBody, RegisterReqBody, TokenPayload } from '~/models/requests/User.requests';
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

// Refresh token
export const refreshTokenController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { user_id, role, exp } = req.decoded_refresh_token as TokenPayload;
  const { refresh_token } = req.body;
  const { new_access_token, new_refresh_token } = await usersService.refreshToken({
    user_id,
    role,
    refresh_exp: exp,
    refresh_token
  });
  return res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESSFULLY,
    data: {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  });
};

// Lấy thông tin người dùng hiện tại (chỉ khi đã đăng nhập)
export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const user = await usersService.getMe(user_id);
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESSFULLY,
    data: {
      user
    }
  });
};
