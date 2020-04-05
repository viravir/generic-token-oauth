export declare type AuthenticationError = {
    type: string;
    message: string;
    data?: object;
};
export declare type GoogleAuthError = {
    statusCode: number;
    data?: string;
};
export declare type GoogleAuthErrorData = {
    error?: string;
    error_description?: string;
};
