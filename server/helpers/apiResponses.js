export const apiResponses = {
  500: () => ({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'You request cannot be completed at the moment, please try again later.',
  }),
  account: {
    createSuccess: (signedJwt, payload) => ({
      statusCode: 201,
      message: 'Your account was successfully created.',
      token: signedJwt,
      user: payload,
    }),
    createFailure: userInput => ({
      statusCode: 409,
      error: 'Email conflict',
      message: `The email ${userInput.email} already exists. If you are the owner, please log in.`,
    }),
    loginSuccess: (signedJwt, payload) => ({
      statusCode: 200,
      message: 'You\'ve been successfully logged in.',
      token: signedJwt,
      user: payload,
    }),
    loginFailure: () => ({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Authentication failed, please check your credentials',
    }),
  },
  request: {
    noRequests: () => ({
      statusCode: 404,
      error: 'No requests found',
      message: 'You have no requests at the moment. ' +
            'Do you have any item that needs fixing? We love fixing stuff!',
      result: [],
    }),
    yesRequests: queryResult => ({
      statusCode: 200,
      message: 'Your requests were succesfully retrieved',
      result: queryResult.rows,
    }),
    createSuccess: queryResult => ({
      statusCode: 201,
      message: 'Your request was successfuly created and is pending admin approval.',
      result: {
        id: queryResult.rows[0].id,
        type: queryResult.rows[0].type,
        item: queryResult.rows[0].item,
        model: queryResult.rows[0].model,
        detail: queryResult.rows[0].detail,
        createdAt: queryResult.rows[0].created_at,
      },
    }),
    createFailureItem: () => ({
      statusCode: 400,
      error: 'Blank Item',
      message: 'The request item cannot be empty.',
    }),
    createFailureDetail: () => ({
      statusCode: 400,
      error: 'Blank Description',
      message: 'The request description cannot be empty.',
    }),
    noRequest: () => ({
      statusCode: 404,
      error: 'Request not found',
      message: 'You have no request with that id, please try another request id',
      result: {},
    }),
    yesRequest: queryResult => ({
      statusCode: 200,
      message: 'Your request was successfully retrieved',
      result: queryResult.rows[0],
    }),
    deleteSuccess: () => ({
      statusCode: 200,
      message: 'The request was succesfully deleted',
    }),
    deleteFailure: () => ({
      statusCode: 404,
      message: 'You have no request with that id, please try another request id',
    }),
    updateSuccess: queryResult => ({
      statusCode: 200,
      message: 'You have successfully updated the request',
      result: queryResult.rows[0],
    }),
    updateFailure: req => ({
      statusCode: 404,
      error: 'Request not found',
      message: `You have no unapproved request with id ${req.params.requestId}. ` +
            'You cannot edit a request that has been approved.',
    }),
  },
  admin: {
    noRequests: () => ({
      statusCode: 404,
      error: 'No requests found',
      message: 'There are no requests in the system.',
      result: [],
    }),
    yesRequests: queryResult => ({
      statusCode: 200,
      message: 'Requests retrieved successfully.',
      result: queryResult.rows,
    }),
    noRequest: () => ({
      statusCode: 404,
      error: 'No request found',
      message: 'There is no request with that id. Please try another request id.',
      result: {},
    }),
    yesRequest: queryResult => ({
      statusCode: 200,
      message: 'The request was successfully retrieved',
      result: queryResult.rows[0],
    }),
    approveFailure: () => ({
      statusCode: 404,
      error: 'No request found',
      message: 'There is no request in review with that id. Please try another request id.',
    }),
    approveSuccess: queryResult => ({
      statusCode: 200,
      message: 'The request was successfully approved. Time to get to work!',
      result: queryResult.rows[0],
    }),
    disapproveFailure: () => ({
      statusCode: 404,
      error: 'No request found',
      message: 'There is no unresolved request with that id. Please try another request id.',
    }),
    disapproveSuccess: queryResult => ({
      statusCode: 200,
      message: 'The request was successfully disapproved',
      result: queryResult.rows[0],
    }),
    resolveFailure: () => ({
      statusCode: 404,
      error: 'No request found',
      message: 'There is no pending request with that id. Please try another request id.',
    }),
    resolveSuccess: queryResult => ({
      statusCode: 200,
      message: 'The request was resolved successfully.',
      result: queryResult.rows[0],
    }),
  },
};
