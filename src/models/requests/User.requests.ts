import { JwtPayload } from 'jsonwebtoken';
import { TokenType, UserGender, UserRole } from '~/constants/enum';

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

// Body: Refresh token
export type RefreshTokenReqBody = LogoutReqBody;

// Body: Cập nhật thông tin người dùng
export interface UpdateMeReqBody {
  fullname?: string;
  username?: string;
  avatar?: string | null;
  cover?: string | null;
  bio?: string;
  gender?: UserGender;
  phone_number?: string;
  date_of_birth?: string;
}

// Body: Đổi mật khẩu
export interface ChangePasswordReqBody {
  old_password: string;
  password: string;
  confirm_password: string;
}
