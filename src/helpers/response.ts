const createResponse = (statusCode: number, message: string, data?: object) => {
  return {
    statusCode,
    // headers: {}
    body: JSON.stringify(data ? { message, data } : { message }),
  };
};

export const createdResponse = (data?: object) =>
  createResponse(201, "Creation successfull", data);

export const successResponse = (message: string, data?: object) =>
  createResponse(200, message, data);

export const errorResponse = (code = 1000, error: any) => {
  if (Array.isArray(error)) {
    const errorObject = error[0].constraints;
    const errorMesssage =
      errorObject[Object.keys(errorObject)[0]] || "An Error Occured";
    return createResponse(code, errorMesssage);
  }

  return createResponse(code, `${error}`, error);
};
