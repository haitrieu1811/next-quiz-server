export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Lỗi xác thực',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token là bắt buộc',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token là bắt buộc',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Refresh token đã được sử dụng hoặc không tồn tại',
  EMAIL_IS_REQUIRED: 'Email là bắt buộc',
  EMAIL_MUST_BE_A_STRING: 'Email phải là một chuỗi',
  EMAIL_IS_INVALID: 'Email không hợp lệ',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
  PASSWORD_IS_REQUIRED: 'Mật khẩu là bắt buộc',
  PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là một chuỗi',
  PASSWORD_LENGTH_IS_INVALID: 'Mật khẩu phải có độ dài từ 6 đến 32 ký tự',
  PASSWORD_IS_WEAK: 'Mật khẩu phải chứa ít nhất 1 chữ cái viết thường, 1 chữ cái viết hoa, 1 số và 1 ký tự đặc biệt',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Xác nhận mật khẩu là bắt buộc',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Xác nhận mật khẩu phải là một chuỗi',
  CONFIRM_PASSWORD_NOT_MATCH: 'Xác nhận mật khẩu không khớp với mật khẩu',
  REGISTER_SUCCESSFULLY: 'Đăng ký thành công'
} as const;
