import { JwtPayload } from 'jsonwebtoken'

export interface TokenPayload extends JwtPayload {
  user_id: string
  verify: UserVerifyStatus
  role: UserRole
  token_type: TokenType
  iat: number
  exp: number
}
