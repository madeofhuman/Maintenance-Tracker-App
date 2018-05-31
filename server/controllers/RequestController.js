import dotenv from 'dotenv';
import Request from '../models/Request';
import { tokenValidator, processRequestInput, validateRequest } from '../helpers/validators';
import { db } from '../database';

dotenv.config();

export default class RequestController {
  static getRequests(req, res, next) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    // query db for user requests ordering by id
    db.query(
      'SELECT * FROM requests WHERE owner = $1 ORDER BY id ASC',
      [req.user.email], (error, result) => {
        if (error) {
          return next(error);
        }

        if (result.rows < 1) {
          return res.status(200).json({ message: 'You have no requests' });
        }

        return res.status(200).json(result.rows);
      },
    );
  }

  static createRequest(req, res, next) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    // process and validate user input
    const processedBody = processRequestInput(req.body);
    const validatedRequest = validateRequest(processedBody, res); // returning 'undefined'

    // set auto-generated fields and create request object
    const owner = req.user.email;
    const request = new Request(
      validatedRequest.type, validatedRequest.item, validatedRequest.model,
      validatedRequest.detail, owner,
    );

    // save valid request to db
    db.query(
      `INSERT INTO requests (type, item, model, detail, status, owner, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        request.type, request.item, request.model,
        request.detail, request.status, request.owner, 'NOW()',
      ], (error, result) => {
        if (error) {
          return next(error);
        }

        if (result.rowCount < 1) {
          res.status(500).json({
            error: 'Your request was unable to be created at the moment, please try again later',
          });
        }

        res.status(201).json({
          message: 'Your request was successfuly created and is pending admin approval.',
        });
      },
    );
  }

  static getRequest(req, res, next) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    // parse string requestId in url to integer
    const requestId = parseInt(req.params.requestId, 10);
    if (typeof requestId !== 'number') {
      return res.status(400).json({ error: 'You have entered an invalid request id' });
    }

    // query db for user request
    db.query(
      'SELECT * FROM requests WHERE owner = $1 AND id = $2',
      [req.user.email, requestId], (error, result) => {
        if (error) {
          return next(error);
        }

        if (result.rows < 1) {
          return res.status(404).json({ message: 'There is no request with that id' });
        }

        return res.status(200).json(result.rows);
      },
    );
  }

  static deleteRequest(req, res, next) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    // parse string requestId in url to integer
    const requestId = parseInt(req.params.requestId, 10);
    if (typeof requestId !== 'number') {
      return res.status(400).json({
        message: `You have entered an invalid request id. 
        A valid request id is a positive integer.`,
      });
    }

    // delete request from db
    db.query(
      'DELETE FROM requests WHERE id = $1 AND owner = $2 RETURNING *',
      [requestId, req.user.email], (error, result) => {
        if (error) {
          return next(error);
        }

        if (result.rowCount < 1) {
          return res.status(404).json({
            message: 'The request does not exist',
          });
        }

        res.status(200).json({ message: 'The request was succesfully deleted' });
      },
    );
  }

  static updateRequest(req, res, next) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    // parse string requestId in url to integer
    const requestId = parseInt(req.params.requestId, 10);
    if (typeof requestId !== 'number') {
      return res.status(400).json({ error: 'You have entered an invalid request id' });
    }

    // process and validate user input
    const processedBody = processRequestInput(req.body);
    const validatedRequest = validateRequest(processedBody, res);

    // db query to update request only if the reques status isn't pending
    db.query(
      `UPDATE requests SET type = $1, item = $2, model = $3, detail = $4, updated_at = $5 
      WHERE id = $6 and owner = $7 and status NOT LIKE $8 RETURNING *`,
      [
        validatedRequest.type, validatedRequest.item, validatedRequest.model,
        validatedRequest.detail, 'NOW()',
        req.params.requestId, req.user.email, 'pending',
      ],
      (error, result) => {
        if (error) {
          return next(error);
        }

        if (result.rowCount < 1) {
          return res.status(404).json({
            message: `No unapproved request with id ${req.params.requestId} was found in the database`,
          });
        }

        res.status(200).json({
          message: 'You have successfully updated the request', result: result.rows[0],
        });
      },
    );
  }


  // Admin
  static getAllRequests(req, res) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    // check if user is admin
    if (tokenValidator.validateAdmin(req.user, res) !== true) {
      return res.status(401).json({
        error: 'You need admin access to perform this opertion',
      });
    }

    // query db for all requests, ordering by id
    db.query('SELECT * FROM requests ORDER BY id ASC', (error, result) => {
      if (error) {
        return error;
      }

      if (result.rows < 1) {
        return res.status(404).json({ error: 'There are no requests in the system' });
      }

      return res.status(200).json(result.rows);
    });
  }

  static approveRequest(req, res, next) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    if (tokenValidator.validateAdmin(req.user, res) !== true) {
      return res.status(401).json({
        error: 'You need admin access to perform this opertion',
      });
    }

    db.query(
      'UPDATE requests SET status = $1 where id = $2 RETURNING *',
      ['pending', req.params.requestId], (error, result) => {
        if (error) {
          return next(error);
        }

        if (result.rows < 1) {
          return res.status(404).json({
            message: `There is no request with id ${req.params.requestId} in the system`,
          });
        }

        return res.status(200).json({
          message: `Request ${req.params.requestId} successfully approved`,
        });
      },
    );
  }

  static disapproveRequest(req, res, next) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    if (tokenValidator.validateAdmin(req.user, res) !== true) {
      return res.status(401).json({
        error: 'You need admin access to perform this opertion',
      });
    }

    db.query(
      'UPDATE requests SET status = $1 where id = $2 RETURNING *',
      ['disapproved', req.params.requestId], (error, result) => {
        if (error) {
          return next(error);
        }

        if (result.rows < 1) {
          return res.status(404).json({
            message: `There is no request with id ${req.params.requestId} in the system`,
          });
        }

        return res.status(200).json({
          message: `Request ${req.params.requestId} successfully disapproved`,
        });
      },
    );
  }

  static resolveRequest(req, res, next) {
    // check for presence of access token in header and validate
    tokenValidator.validateHeaderToken(req.headers.authorization, req, res);

    if (tokenValidator.validateAdmin(req.user, res) !== true) {
      return res.status(401).json({
        error: 'You need admin access to perform this opertion',
      });
    }

    db.query(
      'UPDATE requests SET status = $1 where id = $2 RETURNING *',
      ['resolved', req.params.requestId], (error, result) => {
        if (error) {
          return next(error);
        }

        if (result.rows < 1) {
          return res.status(404).json({
            message: `There is no request with id ${req.params.requestId} in the system`,
          });
        }

        return res.status(200).json({
          message: `Request ${req.params.requestId} completed successfully`,
        });
      },
    );
  }
}
