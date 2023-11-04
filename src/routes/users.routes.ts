import { Router } from 'express';

import {
  getMeController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '~/controllers/users.controllers';
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares';
import { wrapRequestHandler } from '~/utils/handler';

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

export default usersRouter;
