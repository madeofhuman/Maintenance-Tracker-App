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
          return res.status(400).json({ message: `The email ${user.email} already exists` });
        }

        if (result.rowCount < 1) {
          res.status(500).json({
            message: 'The user account was unable to be created, please try again later',
          });
        }

        res.status(201).json({
          message: 'The user has been created successfully',
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

    // query db for user with matching email
    db.query('SELECT * FROM users WHERE email = $1', [email], (queryError, queryResult) => {
      if (queryError) {
        res.status(500).json({
          error: 'Your request cannot be completed at the moment, please try again later',
        });
        return queryError;
      }

      if (queryResult.rowCount < 1) {
        return res.status(400).json({
          message: 'There is no user with the given email, please check your entry',
        });
      }

      // compare password hash and create jwt token
      bcrypt.compare(password, queryResult.rows[0].password_hash, (bcryptError, bcryptResult) => {
        if (bcryptResult) {
          jwt.sign(queryResult.rows[0], secretKey, { expiresIn: '1800s' }, (jwtError, token) => {
            res.set('Token', token);
            res.status(200).json({ message: 'You\'ve been successfully logged in' });
          });
        } else {
          return res.status(400).json({ message: 'You entered an incorrect password, please review' });
        }
      });
    });
  }
}
