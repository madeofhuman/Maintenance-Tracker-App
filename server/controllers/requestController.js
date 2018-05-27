import dotenv from 'dotenv';
import Request from '../models/request';
import { validateRequest, tokenValidator } from '../helpers/validators';
import { db } from '../database';

dotenv.config();

export default class RequestController {
  static getRequests(req, res, next) {
    if (!req.headers.token || req.headers.token === 'undefined') {
      return res.status(401).json({
        message: 'Please log in to use the app',
      });
    }

    const tokenValidationResult = tokenValidator.validateToken(req.headers.token);

    if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
      return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
    }

    db.query('SELECT * FROM requests WHERE owner = $1', [tokenValidationResult.email], (error, result) => {
      if (error) {
        return next(error);
      }

      if (result.rows < 1) {
        return res.status(404).json({ error: 'You have no requests' });
      }

      return res.status(200).json(result.rows);
    });
  }

  static createRequest(req, res, next) {
    if (!req.headers.token || req.headers.token === 'undefined') {
      return res.status(401).json({
        message: 'Please log in to use the app',
      });
    }
    const tokenValidationResult = tokenValidator.validateToken(req.headers.token);
    if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
      return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
    }

    const {
      type, item, model, detail,
    } = req.body;
    const bodyValidationResult = validateRequest(req.body);
    if (bodyValidationResult !== true) {
      res.status(bodyValidationResult.errorCode).json(bodyValidationResult);
    }

    const status = 'pending';
    const owner = tokenValidationResult.email;
    const request = new Request(type, item, model, detail, status, owner);

    db.query('INSERT INTO requests (type, item, model, detail, status, owner, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [request.type, request.item, request.model, request.detail, request.status, request.owner, 'NOW()'], (error, result) => {
      if (error) {
        res.json(error);
        return next(error);
      }

      if (result.rowCount < 1) {
        res.status(500).json({ message: 'Your request was unable to be created at the moment, please try again later' });
      }

      res.status(201).json({ message: `Your request with id ${result.rows[0].id} was successfuly created and is pending admin approval.` });
    });
  }

  static getRequest(req, res, next) {
    if (!req.headers.token || req.headers.token === 'undefined') {
      return res.status(401).json({
        message: 'Please log in to use the app',
      });
    }

    const tokenValidationResult = tokenValidator.validateToken(req.headers.token);

    if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
      return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
    }

    const requestId = parseInt(req.params.requestId, 10);

    if (typeof requestId !== 'number') {
      return res.status(400).json({ error: 'You have entered an invalid request id' });
    }

    db.query('SELECT * FROM requests WHERE owner = $1 AND id = $2', [tokenValidationResult.email, requestId], (error, result) => {
      if (error) {
        return next(error);
      }

      if (result.rows < 1) {
        return res.status(404).json({ message: 'There is no request with that id' });
      }

      return res.status(200).json(result.rows);
    });
  }

  static deleteRequest(req, res, next) {
    if (!req.headers.token || req.headers.token === 'undefined') {
      return res.status(401).json({
        message: 'Please log in to use the app',
      });
    }

    const tokenValidationResult = tokenValidator.validateToken(req.headers.token);

    if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
      return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
    }

    const requestId = parseInt(req.params.requestId, 10);

    if (typeof requestId !== 'number') {
      return res.status(400).json({ message: 'You have entered an invalid request id. A valid request id is a positive integer.' });
    }

    db.query('DELETE FROM requests WHERE id = $1 AND owner = $2 RETURNING *', [requestId, tokenValidationResult.email], (error, result) => {
      if (error) {
        return next(error);
      }

      if (result.rowCount < 1) {
        return res.status(404).json({ message: `No request with id ${req.params.requestId} was found in the database` });
      }

      res.status(200).json({ message: 'The request was succesfully deleted' });
    });
  }

  static updateRequest(req, res, next) {
    if (!req.headers.token || req.headers.token === 'undefined') {
      return res.status(401).json({
        message: 'Please log in to use the app',
      });
    }
    const tokenValidationResult = tokenValidator.validateToken(req.headers.token);
    if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
      return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
    }

    const requestId = parseInt(req.params.requestId, 10);

    if (typeof requestId !== 'number') {
      return res.status(400).json({ error: 'You have entered an invalid request id' });
    }

    const bodyValidationResult = validateRequest(req.body);
    if (bodyValidationResult !== true) {
      res.status(bodyValidationResult.errorCode).json(bodyValidationResult);
    }

    db.query(
      'UPDATE requests SET type = $1, item = $2, model = $3, detail = $4, updated_at = $5 WHERE id = $6 and owner = $7 and status NOT LIKE $8',
      [req.body.type, req.body.item, req.body.model, req.body.detail, 'NOW()', req.params.requestId, tokenValidationResult.email, 'pending'],
      (error, result) => {
        if (error) {
          console.log(error);
          return next(error);
        }

        if (result.rowCount < 1) {
          return res.status(500).json({ message: `No unapproved request with id ${req.params.requestId} was found in the database` });
        }

        res.status(200).json({ message: 'You have successfully updated the request' });
      },
    );
  }

  static getAllRequests(req, res, next) {
    if (!req.headers.token || req.headers.token === 'undefined') {
      return res.status(401).json({
        message: 'Please log in to use the app',
      });
    }
    const tokenValidationResult = tokenValidator.validateToken(req.headers.token);
    if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
      return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
    }

    const adminValidationResult = tokenValidator.validateAdmin(tokenValidationResult);
    if (adminValidationResult !== true) {
      return res.status(adminValidationResult.errorCode).json(adminValidationResult);
    }

    console.log(adminValidationResult);

    db.query('SELECT * FROM requests ORDER BY id ASC', (error, result) => {
      if (error) {
        return next(error);
      }

      if (result.rows < 1) {
        return res.status(404).json({ error: 'There are no requests in the system' });
      }

      return res.status(200).json(result.rows);
    });
  }

  static approveRequest(req, res, next) {
    if (!req.headers.token || req.headers.token === 'undefined') {
      return res.status(401).json({
        message: 'Please log in to use the app',
      });
    }
    const tokenValidationResult = tokenValidator.validateToken(req.headers.token);
    if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
      return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
    }

    const adminValidationResult = tokenValidator.validateAdmin(tokenValidationResult);
    if (adminValidationResult !== true) {
      return res.status(adminValidationResult.errorCode).json(adminValidationResult);
    }

    db.query('UPDATE requests SET status = $1 where id = $2 RETURNING *', ['pending', req.params.requestId], (error, result) => {
      if (error) {
        return next(error);
      }

      if (result.rows < 1) {
        return res.status(404).json({ message: `There is no request with id ${req.params.requestId} in the system` });
      }

      return res.status(200).json({ message: `Request ${req.params.requestId} successfully approved` });
    });
  }

  static disapproveRequest(req, res, next) {
    if (!req.headers.token || req.headers.token === 'undefined') {
      return res.status(401).json({
        message: 'Please log in to use the app',
      });
    }
    const tokenValidationResult = tokenValidator.validateToken(req.headers.token);
    if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
      return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
    }

    const adminValidationResult = tokenValidator.validateAdmin(tokenValidationResult);
    if (adminValidationResult !== true) {
      return res.status(adminValidationResult.errorCode).json(adminValidationResult);
    }

    db.query('UPDATE requests SET status = $1 where id = $2 RETURNING *', ['disapproved', req.params.requestId], (error, result) => {
      if (error) {
        return next(error);
      }

      if (result.rows < 1) {
        return res.status(404).json({ message: `There is no request with id ${req.params.requestId} in the system` });
      }

      return res.status(200).json({ message: `Request ${req.params.requestId} successfully disapproved` });
    });
  }

  static resolveRequest(req, res, next) {
    if (!req.headers.token || req.headers.token === 'undefined') {
      return res.status(401).json({
        message: 'Please log in to use the app',
      });
    }
    const tokenValidationResult = tokenValidator.validateToken(req.headers.token);
    if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
      return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
    }

    const adminValidationResult = tokenValidator.validateAdmin(tokenValidationResult);
    if (adminValidationResult !== true) {
      return res.status(adminValidationResult.errorCode).json(adminValidationResult);
    }

    db.query('UPDATE requests SET status = $1 where id = $2 RETURNING *', ['resolved', req.params.requestId], (error, result) => {
      if (error) {
        return next(error);
      }

      if (result.rows < 1) {
        return res.status(404).json({ message: `There is no request with id ${req.params.requestId} in the system` });
      }

      return res.status(200).json({ message: `Request ${req.params.requestId} completed successfully` });
    });
  }
}
