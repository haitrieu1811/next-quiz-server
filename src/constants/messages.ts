export const COMMON_MESSAGES = {
  VALIDATION_ERROR: 'Lỗi xác thực',
  PAGE_MUST_BE_A_NUMBER: 'Trang phải là một số',
  PAGE_MUST_BE_A_POSITIVE_NUMBER: 'Trang phải là một số dương',
  LIMIT_MUST_BE_A_NUMBER: 'Giới hạn kết quả trả về phải là một số',
  LIMIT_MUST_BE_A_POSITIVE_NUMBER: 'Giới hạn kết quả trả về phải là một số dương',
  LIMIT_MUST_BE_LESS_THAN_100: 'Giới hạn kết quả trả về phải nhỏ hơn 100'
} as const;

export const USERS_MESSAGES = {
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
  REGISTER_SUCCESSFULLY: 'Đăng ký thành công',
  EMAIL_NOT_EXIST: 'Email không tồn tại trong hệ thống',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không chính xác',
  LOGIN_SUCCESSFULLY: 'Đăng nhập thành công',
  LOGOUT_SUCCESSFULLY: 'Đăng xuất thành công',
  REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token thành công',
  GET_ME_SUCCESSFULLY: 'Lấy thông tin tài khoản thành công',
  UPDATE_ME_SUCCESSFULLY: 'Cập nhật thông tin tài khoản thành công',
  FULLNAME_MUST_BE_A_STRING: 'Họ và tên phải là một chuỗi',
  FULLNAME_LENGTH_IS_INVALID: 'Họ và tên phải có độ dài từ 2 đến 32 ký tự',
  AVATAR_IS_INVALID: 'Ảnh đại diện không hợp lệ',
  COVER_IS_INVALID: 'Ảnh bìa không hợp lệ',
  BIO_MUST_BE_A_STRING: 'Tiểu sử phải là một chuỗi',
  BIO_LENGTH_IS_INVALID: 'Tiểu sử phải có độ dài từ 2 đến 255 ký tự',
  GENDER_IS_INVALID: 'Giới tính không hợp lệ',
  PHONE_NUMBER_MUST_BE_A_STRING: 'Số điện thoại phải là một chuỗi',
  PHONE_NUMBER_IS_INVALID: 'Số điện thoại không hợp lệ',
  DATE_OF_BIRTH_IS_INVALID: 'Ngày sinh không hợp lệ',
  PHONE_NUMBER_ALREADY_EXISTS: 'Số điện thoại đã tồn tại',
  CHANGE_PASSWORD_SUCCESSFULLY: 'Đổi mật khẩu thành công',
  OLD_PASSWORD_IS_INCORRECT: 'Mật khẩu cũ không chính xác'
} as const;

export const IMAGES_MESSAGES = {
  FILE_TYPE_INVALID: 'Loại file không hợp lệ',
  IMAGE_FIELD_IS_REQUIRED: 'Trường ảnh là bắt buộc',
  UPLOAD_IMAGE_SUCCESSFULLY: 'Tải ảnh lên thành công'
} as const;

export const TOPICS_MESSAGES = {
  CREATE_TOPIC_SUCCESSFULLY: 'Tạo chủ đề thành công',
  TOPIC_NAME_IS_REQUIRED: 'Tên chủ đề là bắt buộc',
  TOPIC_NAME_MUST_BE_A_STRING: 'Tên chủ đề phải là một chuỗi',
  TOPIC_NAME_ALREADY_EXISTS: 'Tên chủ đề đã tồn tại',
  GET_TOPICS_SUCCESSFULLY: 'Lấy danh sách chủ đề thành công',
  UPDATE_TOPIC_SUCCESSFULLY: 'Cập nhật chủ đề thành công',
  TOPIC_ID_IS_REQUIRED: 'Topic id là bắt buộc',
  TOPIC_ID_IS_INVALID: 'Topic id không hợp lệ',
  TOPIC_IS_NOT_EXISTED: 'Topic không tồn tại',
  TOPIC_IDS_IS_REQUIRED: 'Topic ids là bắt buộc',
  TOPIC_IDS_IS_EMPTY: 'Topic ids không được rỗng',
  TOPIC_IDS_IS_INVALID: 'Topic ids không hợp lệ'
} as const;

export const QUIZZES_MESSAGES = {
  QUIZ_NAME_IS_REQUIRED: 'Tên quiz là bắt buộc',
  QUIZ_NAME_MUST_BE_A_STRING: 'Tên quiz phải là một chuỗi',
  QUIZ_LEVEL_IS_REQUIRED: 'Level quiz là bắt buộc',
  QUIZ_LEVEL_IS_INVALID: 'Level quiz không hợp lệ',
  QUIZ_TOPIC_IS_INVALID: 'Quiz topic không hợp lệ',
  QUIZ_DESCRIPTION_MUST_BE_A_STRING: 'Mô tả quiz phải là một chuỗi',
  QUIZ_TOPIC_NOT_EXISTED: 'Quiz topic không tồn tại',
  CREATE_QUIZ_SUCCESSFULLY: 'Tạo quiz thành công',
  QUIZ_NAME_IS_EXISTED: 'Tên quiz đã tồn tại',
  GET_QUIZZES_SUCCESSFULLY: 'Lấy danh sách quiz thành công',
  UPDATE_QUIZ_SUCCESSFULLY: 'Cập nhật quiz thành công',
  QUIZ_ID_IS_REQUIRED: 'Quiz id là bắt buộc',
  QUIZ_ID_IS_INVALID: 'Quiz id không hợp lệ',
  QUIZ_IS_NOT_EXISTED: 'Quiz không tồn tại',
  QUIZ_ID_MUST_BE_A_STRING: 'Quiz id phải là một chuỗi',
  QUIZ_NOT_EXISTED: 'Quiz không tồn tại',
  QUIZ_IDS_IS_REQUIRED: 'Quiz ids là bắt buộc',
  QUIZ_IDS_IS_NOT_EMPTY: 'Quiz ids không được rỗng',
  QUIZ_IDS_IS_INVALID: 'Quiz ids không hợp lệ',
  QUIZ_IDS_ARE_NOT_EXISTED: 'Quiz ids không tồn tại',
  QUIZ_IDS_MUST_BE_AN_ARRAY: 'Quiz ids phải là một mảng'
} as const;
