import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secretKey = process.env.JWT_KEY;

export const tokenValidator = {
  validateAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({
        statusCode: 401,
        error: 'Unauthorised access',
        message: 'Are you trying to go where you should not? ' +
        'You need admin access to see what goes on here.',
      });
    }
    return next();
  },

  validateUser: (req, res, next) => {
    const bearer = req.headers.authorization.split(' ');
    const accessToken = bearer[1];
    jwt.verify(accessToken, secretKey, (jwtError, authData) => {
      if (jwtError) {
        return res.status(401).json({
          statusCode: 401,
          error: 'Invalid or expired access token',
          message: 'For security reasons, you have been logged out of the application. ' +
          'Please log in to continue using the app.',
        });
      }
      req.user = authData;
      return next();
    });
  },
};
