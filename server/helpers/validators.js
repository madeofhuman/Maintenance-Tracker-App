import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secretKey = process.env.JWT_KEY;

export const validateRequest = function validateRequestBody(request) {
  let result;

  switch (request) {
    case (request.type === undefined || (request.type !== 'repair' && request.type !== 'maintenance')):
      result = {
        errorMessage: 'You supplied an invalid request type. A request can only be \'maintenance\' or \'repair\'',
        errorCode: 400,
      };
      break;
    case (request.item === undefined || request.item.length < 3):
      result = {
        errorMessage: 'You supplied an invalid item. An item must be a string of more than three characters.',
        errorCode: 400,
      };
      break;
    case (request.type === 'repair' && (request.detail == null || request.detail.length < 10)):
      result = {
        errorMessage: 'Please enter a description of the error that is more than ten characters',
        errorCode: 400,
      };
      break;
    default:
      result = 'valid';
      break;
  }
  return result; // working
};

export const processAndValidateInput = function processAndValidateUserInput(userInput) {
  // convert input to string and trim spaces
  const [type, item, model, detail] =
  Object.values(userInput)
    .map((value) => {
      if (typeof value === 'number') {
        return value.toString();
      }
      return value.toLowerCase().trim();
    });

  const processedBody = {
    type, item, model, detail,
  };

  // validate processed request
  validateRequest(processedBody); // transferring to this function
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
  validateAdmin: function validateAdminRole(authenticatedUser, res) {
    if (authenticatedUser.role !== 'admin') {
      return res.status(403).json({
        message: 'You need admin access to perform this opertion',
      });
    }
  },

  validateToken: function validatePresenceAndGenuinenessOfAccessToken(accessToken, req, res) {
    if (!accessToken || accessToken === 'undefined') {
      return res.status(401).json({
        message: 'Please log in to use the app',
      });
    }
    jwt.verify(accessToken, secretKey, (jwtError, authData) => {
      if (jwtError) {
        return res.status(400).json({
          message: 'Invalid or expired access token, please log in to access the app',
        });
      }
      req.user = authData;
    });
  },
};
