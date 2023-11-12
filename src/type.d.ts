import 'express';
import { UserResult } from './models/schemas/User.schema';

declare module 'express' {
  interface Request {
    decoded_authorization?: TokenPayload;
    decoded_refresh_token?: TokenPayload;
    user?: UserResult;
  }
}
