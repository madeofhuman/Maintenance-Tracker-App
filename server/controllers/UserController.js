import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { db } from '../database';
import { apiResponses } from '../helpers/apiResponses';

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
          return res.status(500).json(apiResponses['500']);
        }

        res.status(201).json(apiResponses.account.createSuccess(result));
      })
      .catch(() => res.status(409).json(apiResponses.account.createFailure(user)));
  }

  static userLogin(req, res) {
    const {
      email, password,
    } = req.body;

    // query db for user with matching email
    db.query('SELECT * FROM users WHERE email = $1', [email])
      .then((result) => {
        if (result.rowCount < 1) {
          return res.status(403).json(apiResponses.account.loginFailure());
        }

        // compare password hash and create jwt token
        bcrypt.compare(password, result.rows[0].password_hash, (bcryptError, bcryptResult) => {
          if (bcryptResult) {
            const payload = {
              firstName: result.rows[0].first_name,
              lastName: result.rows[0].last_name,
              email: result.rows[0].email,
              role: result.rows[0].role,
            };
            return jwt.sign(payload, secretKey, { expiresIn: '1day' }, (jwtError, token) => res
              .status(200).json(apiResponses.account.loginSuccess(token)));
          }

          return res.status(403).json(apiResponses.account.loginFailure());
        });
      })
      .catch((e) => {
        console.error('error', e.stack);
        return res.status(500).json(apiResponses['500']);
      });
  }
}
