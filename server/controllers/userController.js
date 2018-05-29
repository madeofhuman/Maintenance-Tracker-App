// import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { validateUser } from '../helpers/validators';
import { db } from '../database';

// dotenv.config();

const secretKey = process.env.JWT_KEY;

export default class UserController {
  static createUser(req, res) {
    const {
      firstName, lastName, email, password,
    } = req.body;

    const validationResult = validateUser(req.body);

    if (validationResult === 'firstNameError') {
      return res.status(400).json({
        error: 'Please enter your first name',
      });
    }

    if (validationResult === 'lastNameError') {
      return res.status(400).json({
        error: 'Please enter your last name',
      });
    }

    if (validationResult === 'emailError') {
      return res.status(400).json({
        error: 'Please enter a valid email',
      });
    }

    if (validationResult === 'passwordError') {
      return res.status(400).json({
        error: 'Please enter a password',
      });
    }

    if (validationResult === 'passwordLengthError') {
      return res.send({ error: 'Please enter a longer password' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = new User(firstName, lastName, email, passwordHash);

    db.query('INSERT INTO users (first_name, last_name, email, role, password_hash, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [user.firstName, user.lastName, user.email, user.role, user.password, 'NOW()'], (error, result) => {
      if (error) {
        // console.log('abc ', error);
        return res.status(400).json({ message: error.detail });
      }

      if (result.rowCount < 1) {
        res.status(500).json({
          message: 'The user account was unable to be created, please try again later',
        });
      }
      res.status(201).json({ message: 'The user has been created successfully', result: result.rows[0] });
    });
  }

  static userLogin(req, res) {
    const {
      email, password,
    } = req.body;

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

      bcrypt.compare(password, queryResult.rows[0].password_hash, (bcryptError, bcryptResult) => {
        if (bcryptResult) {
          jwt.sign(queryResult.rows[0], secretKey, { expiresIn: '1800s' }, (jwtError, token) => {
            res.set('Content-Type', 'application/json');
            res.status(302).json({ message: 'You\'ve been successfully logged in', token });
          });
        } else {
          return res.status(400).json({ message: 'You entered an incorrect password, please review' });
        }
      });
    });
  }


  static userLogout(req, res, next) {
    res.headers.token = '';
    res.token = '';
    res.status(200).redirect('/api/v1');
    next();
  }
}
