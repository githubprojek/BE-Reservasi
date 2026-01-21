// Utility functions for standardized HTTP responses
const response_handler = (res, status, content = null, message = "", errors = []) => {
  return res.status(status).json({ content, message, errors });
};

export const response_bad_request = (res, message = "Bad Request", errors = []) => {
  return response_handler(res, 400, undefined, message, errors);
};

export const response_unauthorized = (res, message = "Unauthorized", errors = []) => {
  return response_handler(res, 401, undefined, message, errors);
};

export const response_forbidden = (res, message = "Forbidden", errors = []) => {
  return response_handler(res, 403, undefined, message, errors);
};

export const response_not_found = (res, message = "Not Found", errors = []) => {
  return response_handler(res, 404, undefined, message, errors);
};

export const response_unprocessable_entity = (res, message = "Validation Error", errors = []) => {
  return response_handler(res, 422, undefined, message, errors);
};

export const response_internal_server_error = (res, message = "Internal Server Error", errors = []) => {
  return response_handler(res, 500, undefined, message, errors);
};

export const response_success = (res, content = null, message = "Success") => {
  return response_handler(res, 200, content, message, undefined);
};

export const response_created = (res, content = null, message = "Created") => {
  return response_handler(res, 201, content, message, undefined);
};

export const response_deleted = (res, content = null, message = "Deleted") => {
  return response_handler(res, 204, content, message, undefined);
};

export const handleServiceErrorWithResponse = (res, serviceResponse) => {
  switch (serviceResponse?.err?.code) {
    case 400:
      return response_bad_request(res, serviceResponse.err?.message);
    case 403:
      return response_forbidden(res, serviceResponse.err?.message);
    case 404:
      return response_not_found(res, serviceResponse.err?.message);
    case 401:
      return response_unauthorized(res, serviceResponse.err?.message);
    default:
      return response_internal_server_error(res, serviceResponse.err?.message);
  }
};
