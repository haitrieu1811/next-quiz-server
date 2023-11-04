import { JwtPayload } from 'jsonwebtoken';
import { TokenType, UserRole } from '~/constants/enum';

export interface TokenPayload extends JwtPayload {
  user_id: string;
  role: UserRole;
  token_type: TokenType;
  iat: number;
  exp: number;
}

// Body: Đăng ký
export interface RegisterReqBody {
  email: string;
  password: string;
  confirm_password: string;
}

// Body: Đăng nhập
export interface LoginReqBody {
  email: string;
  password: string;
}

// Body: Đăng xuất
export interface LogoutReqBody {
  refresh_token: string;
}
