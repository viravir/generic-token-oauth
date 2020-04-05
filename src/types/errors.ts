export type AuthenticationError = {
  type: string;
  message: string;
  data?: object;
};

export type GoogleAuthError = {
  statusCode: number;
  data?: string;
};

export type GoogleAuthErrorData = {
  error?: string;
  error_description?: string;
};
