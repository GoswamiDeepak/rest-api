class CustomErrorHandler extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static alreadyExists(message) {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message = "username or password is incorrect") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthorized(message = "Unauthorized access") {
    return new CustomErrorHandler(401, message);
  }

  static notFound(message = "Not found") {
    return new CustomErrorHandler(404, message);
  }

  static serverError(message = "Internal Server Error") {
    return new CustomErrorHandler(500, message);
  }
}

export default CustomErrorHandler;
