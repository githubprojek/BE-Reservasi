export const INTERNAL_SERVER_ERROR_SERVICE_RESPONSE = {
  status: false,
  data: {},
  err: {
    message: "Internal Server Error",
    code: 500,
  },
};

export const INVALID_ID_SERVICE_RESPONSE = {
  status: false,
  data: {},
  err: {
    message: "Invalid ID, Data not Found",
    code: 404,
  },
};

export function BadRequestWithMessage(message) {
  return {
    status: false,
    data: {},
    err: {
      message,
      code: 400,
    },
  };
}
