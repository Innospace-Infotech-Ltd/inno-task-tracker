export enum DbError {
  DUPLICATE_ERROR = 'E11000 duplicate key error collection',
}

export enum ErrorCode {
  INVALID_LOGIN_CRED = 401001,
  NOT_LOGGED_IN = 401002,

  USER_NOT_FOUND = 404001,
  TASK_NOT_FOUND = 404002,
}
