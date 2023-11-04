import { Router } from 'express';

import { loginController, logoutController, registerController } from '~/controllers/users.controllers';
import { loginValidator, refreshTokenValidator, registerValidator } from '~/middlewares/users.middlewares';
import { wrapRequestHandler } from '~/utils/handler';

const usersRouter = Router();

// Đăng ký
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController));

// Đăng nhập
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController));

// Đăng xuất
usersRouter.post('/logout', refreshTokenValidator, wrapRequestHandler(logoutController));

export default usersRouter;
