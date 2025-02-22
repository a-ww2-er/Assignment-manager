//ERROR CLASS TO BUILD ERROR RESPONSE OBJECT
export class HttpException extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  errors: any;
  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    errors?: any
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

//PERSONALLY DEFINED ERROR CODES FOR THIS API
export enum ErrorCode {
  USER_NOT_FOUND = 2094,
  USER_ALREADY_EXISTS = 2095,
  INVALID_CREDENTIALS = 2096,
  INVALID_QUERY = 2080,
  VALIDATION_ERROR = 2190,
  INTERNAL_EXCEPTION = 3000,
  UNAUTHORIZED_ACCESS = 2400,
  NOT_AUTHENTICATED = 2350,
  SERVICE_NOT_FOUND = 2092,
  ROUTE_NOT_FOUND = 2091,
  INVALID_REFRESH_TOKEN = 2093,
  LOCATION_NOT_FOUND = 2157,
}
