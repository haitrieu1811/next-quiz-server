import 'express';

declare module 'express' {
  interface Request {
    decoded_authorization?: TokenPayload;
    decoded_refresh_token?: TokenPayload;
    user?: User;
  }
}
