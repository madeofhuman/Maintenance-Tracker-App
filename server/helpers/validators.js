import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secretKey = process.env.JWT_KEY;

// validate request body
export const validateRequest = function validateRequestBody(request, res) {
  if (request.type === 'undefined' || (request.type !== 'repair' && request.type !== 'maintenance')) {
    return res.status(400).json({
      error: 'You supplied an invalid request type. A request can only be \'maintenance\' or \'repair\'',
    });
  } else if (request.item === undefined || request.item.length < 3) {
    return res.status(400).json({
      error: 'You supplied an invalid item. An item must be a string of more than three characters.',
    });
  } else if (request.type === 'repair' && (request.detail == null || request.detail.length < 10)) {
    return res.status(400).json({
      error: 'Please enter a description of the error that is more than ten characters',
    });
  }
  return request;
};

// process user request-creation input
export const processRequestInput = function processUserRequestInput(input) {
  // convert input to string and trim spaces
  const [type, item, model, detail] =
  Object.values(input)
    .map((value) => {
      if (typeof value === 'number') {
        return value.toString();
      }
      return value.toLowerCase().trim();
    });

  const processedBody = {
    type, item, model, detail,
  };
  return processedBody;
};

// validate processed user input
export const validateUser = function validateUserBody(processedUserDetails, res) {
  const {
    firstName, lastName, email, password,
  } = processedUserDetails;

  if (firstName === undefined || firstName === '') {
    return res.status(400).json({
      error: 'Please enter your first name',
    });
  } else if (lastName === undefined || lastName === '') {
    return res.status(400).json({
      error: 'Please enter your last name',
    });
  } else if (email === undefined || email < 5) {
    return res.status(400).json({
      error: 'Please enter a valid email',
    });
  } else if (password === undefined || password === '') {
    return res.status(400).json({
      error: 'Please enter a password',
    });
  } else if (password.length < 4) {
    return res.status(400).json({
      error: 'Please enter a password longer than four characters',
    });
  }
  return processedUserDetails;
};

// process user signup input
export const processUserInput = function processUserInput(input) {
  // convert input to string and trim spaces
  const [firstName, lastName, email, password] =
  Object.values(input)
    .map((value) => {
      if (typeof value === 'number') {
        return value.toString();
      }
      return value.toLowerCase().trim();
    });

  const processedUserDetails = {
    firstName, lastName, email, password,
  };

  // validate processed request
  return processedUserDetails;
};

export const tokenValidator = {
  validateAdmin: function validateAdminRole(authenticatedUser, res) {
    if (authenticatedUser.role !== 'admin') {
      return res.status(403).json({
        error: 'You need admin access to perform this opertion',
      });
    }
  },

  validateToken: function validatePresenceAndGenuinenessOfAccessToken(accessToken, req, res) {
    if (!accessToken || accessToken === 'undefined') {
      return res.status(401).json({
        error: 'Please log in to use the app',
      });
    }
    jwt.verify(accessToken, secretKey, (jwtError, authData) => {
      if (jwtError) {
        return res.status(400).json({
          error: 'Invalid or expired access token, please log in to access the app',
        });
      }
      req.user = authData;
    });
  },
};
