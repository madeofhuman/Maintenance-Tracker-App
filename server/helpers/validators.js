export const validateRequest = function validateRequestBody(request) {
  const {
    type, item, model, detail,
  } = request;

  if (type === undefined || (type.toLowerCase() !== 'repair' && type.toLowerCase() !== 'maintenance')) {
    return 'typeError';
  }

  if ((item === undefined || item.length < 3)) {
    return 'itemError';
  }

  if (type === undefined || type.toLowerCase() === 'repair') {
    if (detail == null || detail.length < 10) {
      return 'detailError';
    }
  }

  if (model === undefined || model.length < 3) {
    return 'modelError';
  }

  return true;
};

export const validateUser = function validateUserBody() {
  //
};
