import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secretKey = process.env.JWT_KEY;

export const validateRequest = function validateRequestBody(request) {
  const {
    type, item, model, detail,
  } = request;

  let result;

  if (type === undefined || (type.toLowerCase() !== 'repair' && type.toLowerCase() !== 'maintenance')) {
    result = {
      errorMessage: 'You supplied an invalid request type. A request can only be \'maintenance\' or \'repair\'',
      errorCode: 400,
    };
  }

  if ((item === undefined || item.length < 3)) {
    result = {
      errorMessage: 'You supplied an invalid item. An item must be a string of more than three characters.',
      errorCode: 400,
    };
  }

  if (type === undefined || type.toLowerCase() === 'repair') {
    if (detail == null || detail.length < 10) {
      result = {
        errorMessage: 'Please enter a description of the error that is more than ten characters',
        errorCode: 400,
      };
    }
  }

  if (model === undefined || model.length < 3) {
    result = {
      errorMessage: 'Please enter a valid model. A valid model is more than 2 characters',
      errorCode: 400,
    };
  }

  result = true;

  return result;
};

export const validateUser = function validateUserBody(user) {
  const {
    firstName, lastName, email, password,
  } = user;

  if (firstName === undefined) return 'firstNameError';

  if (lastName === undefined) return 'lastNameError';

  if (email === undefined) return 'emailError';

  if (password === undefined) return 'passwordError';

  if (password.length < 4) return 'passwordLengthError';

  return true;
};

export const tokenValidator = {
  validateToken: (accessToken) => {
    let result;

    jwt.verify(accessToken, secretKey, (jwtError, authData) => {
      if (jwtError) {
        result = {
          errorMessage: 'Invalid or expired access token, please log in to access the app',
          errorCode: 400,
        };
        return;
      }

      result = authData;
    });

    return result;
  },

  validateAdmin: (authenticatedUser) => {
    let result;
    if (authenticatedUser.role !== 'admin') {
      result = {
        errorMessage: 'You need admin access to perform this opertion',
        errorCode: 403,
      };
    } else {
      result = true;
    }
    return result;
  },
};
