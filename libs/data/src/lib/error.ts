export interface GqlError {
  message: string;
  extensions: {
    code: string;
    response: {
      statusCode: number;
      message: string;
    };
  };
}
