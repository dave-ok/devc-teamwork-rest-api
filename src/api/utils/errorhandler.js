export class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const dispatchError = (err, res) => {
  let { status } = err;
  const { message } = err;

  status = status || 500;
  res.status(status).json({
    status: 'error',
    error: message,
  });
};
