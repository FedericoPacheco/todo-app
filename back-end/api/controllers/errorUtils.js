const ErrorTypes = require("../constants/ErrorTypes");

module.exports = {
  mapErrorToRes,
};

function mapErrorToRes(error, res) {
  switch (error.message) {
    case ErrorTypes.DB_ERROR:
      return res.serverError(error);
    case ErrorTypes.INVALID_INPUT:
      return res.badRequest(error);
    case ErrorTypes.ENTITY_NOT_FOUND:
      return res.notFound(error);
    case ErrorTypes.INVALID_CREDENTIALS:
      return res.unauthorized(error);
    case ErrorTypes.USER_ALREADY_EXISTS:
      return res.badRequest(error);
    default:
      return res.serverError(error);
  }
}
