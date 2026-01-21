export enum ErrorCode {
  // Member 관련
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  SELLER_NOT_VERIFIED = 'SELLER_NOT_VERIFIED',

  // Work 관련
  WORK_NOT_FOUND = 'WORK_NOT_FOUND',
  INVALID_WORK_STATUS = 'INVALID_WORK_STATUS',

  // 공통
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export const ErrorMessage = {
  [ErrorCode.USER_NOT_FOUND]: '해당 사용자를 찾을 수 없습니다.',
  [ErrorCode.SELLER_NOT_VERIFIED]: '판매자 인증이 완료된 사용자만 가능합니다.',
  [ErrorCode.WORK_NOT_FOUND]: '존재하지 않는 작품입니다.',
};
