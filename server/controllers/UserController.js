import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { db } from '../database';

dotenv.config();

const secretKey = process.env.JWT_KEY;

export default class UserController {
  static createUser(req, res) {
    // get user input
    const {
      firstName, lastName, email, password,
    } = req.body;

    // hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // create user object
    const user = new User(firstName, lastName, email, passwordHash);

    // save user to db
    db.query(
      'INSERT INTO users (first_name, last_name, email, role, password_hash, created_at) ' +
      'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.firstName, user.lastName, user.email, user.role, user.password, 'NOW()'],
    )
      .then((result) => {
        if (result.rowCount < 1) {
          return res.status(500).json({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Oops! Another bug must have crawled into our systems, but we are right on it! Please try your request later :\'(',
          });
        }

        res.status(201).json({
          statusCode: 201,
          message: 'Yay! Your account was successfully created.',
          result: {
            id: result.rows[0].id,
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name,
            email: result.rows[0].email,
          },
        });
      })
      .catch(() => res.status(409).json({
        statusCode: 409,
        error: 'Email conflict',
        message: `The email ${user.email} already exists. If you are the owner, please log in.`,
      }));
  }

  static userLogin(req, res) {
    const {
      email, password,
    } = req.body;

    // query db for user with matching email
    db.query('SELECT * FROM users WHERE email = $1', [email])
      .then((result) => {
        if (result.rowCount < 1) {
          return res.status(403).json({
            statusCode: 403,
            error: 'Forbidden',
            message: 'The email address you entered does not exist',
          });
        }

        const payload = {
          firstName: result.rows[0].first_name,
          lastName: result.rows[0].last_name,
          email: result.rows[0].email,
          role: result.rows[0].role,
        };

        // compare password hash and create jwt token
        bcrypt.compare(password, result.rows[0].password_hash, (bcryptError, bcryptResult) => {
          if (bcryptResult) {
            return jwt.sign(payload, secretKey, { expiresIn: '1day' }, (jwtError, token) => res.status(200).json({
              statusCode: 200,
              message: 'You\'ve been successfully logged in. Go forth and do all the things!',
              token,
            }));
          }

          return res.status(403).json({
            statusCode: 403,
            error: 'Forbidden',
            message: 'The password you entered doesn\'t match the email address',
          });
        });
      })
      .catch((e) => {
        res.status(500).json({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Oops! Another bug must have crawled into our systems, but we are right on it! Please try your request later :\'(',
        });
        console.error('error', e.stack);
      });
  }
}
