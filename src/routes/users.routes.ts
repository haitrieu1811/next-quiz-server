import { Router } from 'express';

import {
  getMeController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  updateMeController
} from '~/controllers/users.controllers';
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  updateMeValidator
} from '~/middlewares/users.middlewares';
import { UpdateMeReqBody } from '~/models/requests/User.requests';
import { filterReqBodyMiddleware, wrapRequestHandler } from '~/utils/handler';

const usersRouter = Router();

// Đăng ký
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController));

// Đăng nhập
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController));

// Đăng xuất
usersRouter.post('/logout', refreshTokenValidator, wrapRequestHandler(logoutController));

// Refresh token
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController));

// Lấy thông tin người dùng hiện tại (chỉ khi đã đăng nhập)
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController));

// Cập nhật thông tin người dùng hiện tại
usersRouter.patch(
  '/me',
  accessTokenValidator,
  updateMeValidator,
  filterReqBodyMiddleware<UpdateMeReqBody>([
    'avatar',
    'bio',
    'cover',
    'date_of_birth',
    'fullname',
    'gender',
    'phone_number'
  ]),
  wrapRequestHandler(updateMeController)
);

export default usersRouter;
