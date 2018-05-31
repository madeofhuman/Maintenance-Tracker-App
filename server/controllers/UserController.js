// import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { processUserInput, validateUser } from '../helpers/validators';
import { db } from '../database';

// dotenv.config();

const secretKey = process.env.JWT_KEY;

export default class UserController {
  static createUser(req, res) {
    // process and validate user input
    const processedUser = processUserInput(req.body);
    const validatedUser = validateUser(processedUser, res);

    const {
      firstName, lastName, email, password,
    } = validatedUser;

    // set auto-generated fields and create User object
    const passwordHash = bcrypt.hashSync(password, 10);
    const user = new User(firstName, lastName, email, passwordHash);

    // save valid user to db
    db.query(
      'INSERT INTO users (first_name, last_name, email, role, password_hash, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.firstName, user.lastName, user.email, user.role, user.password, 'NOW()'], (error, result) => {
        if (error) {
          return res.status(409).json({
            message: `The email ${user.email} already exists. If you're the owner, please log in.`,
          });
        }

        if (result.rowCount < 1) {
          res.status(500).json({
            error: 'Oops! Another bug must have crawled into our systems, but we are right on it! Please try your request later :\'(',
          });
          return error;
        }

        res.status(201).json({
          message: 'Yay! The user was successfully created.',
          result: {
            id: result.rows[0].id,
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name,
            email: result.rows[0].email,
          },
        });
      },
    );
  }

  static userLogin(req, res) {
    const {
      email, password,
    } = req.body;

    const trimmedEmail = email.trim();

    // query db for user with matching email
    db.query('SELECT * FROM users WHERE email = $1', [trimmedEmail], (queryError, queryResult) => {
      if (queryError) {
        res.status(500).json({
          error: 'Oops! Another bug must have crawled into our systems, but we are right on it! Please try your request later :\'(',
        });
        return queryError;
      }

      if (queryResult.rowCount < 1) {
        return res.status(403).json({
          message: 'We couldn\'t find any user with the given email, please check your entry.',
        });
      }

      const payload = {
        firstName: queryResult.rows[0].first_name,
        lastName: queryResult.rows[0].last_name,
        email: queryResult.rows[0].email,
        role: queryResult.rows[0].role,
      };

      // compare password hash and create jwt token
      bcrypt.compare(password, queryResult.rows[0].password_hash, (bcryptError, bcryptResult) => {
        if (bcryptResult) {
          jwt.sign(payload, secretKey, { expiresIn: '1 day' }, (jwtError, token) => {
            res.set('Token', token);
            res.status(200).json({
              message: 'You\'ve been successfully logged in. Go forth and do all the things!',
            });
          });
        } else {
          return res.status(400).json({
            message: 'Oops! The password you entered wasn\'t correct. Please review and try again.',
          });
        }
      });
    });
  }
}
