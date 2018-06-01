import dotenv from 'dotenv';
import Request from '../models/Request';
import { tokenValidator, processRequestInput, validateRequest } from '../helpers/validators';
import { db } from '../database';

dotenv.config();

export default class RequestController {
  static getRequests(req, res) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    // query db for user requests ordering by id
    db.query(
      'SELECT * FROM requests WHERE owner = $1 ORDER BY id ASC',
      [req.user.email], (error, result) => {
        if (error) {
          res.status(500).json({
            error: 'Oops! Another bug must have crawled into our systems, but we are right on it! Please try your request later :\'(',
          });
          return error;
        }

        if (result.rows < 1) {
          return res.status(200).json({
            message: 'You have no requests at the moment. Do you have any item that needs fixing? We love fixing stuff!',
            result: result.rows,
          });
        }

        return res.status(200).json({
          result: result.rows,
        });
      },
    );
  }

  static createRequest(req, res) {
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
          return error;
        }

        if (result.rowCount < 1) {
          res.status(500).json({
            error: 'Oops! Another bug must have crawled into our systems, but we are right on it! Please try your request later :\'(',
          });
          return error;
        }

        res.status(201).json({
          message: 'Yay! Your request was successfuly created and is pending admin approval.',
          request: {
            id: result.rows[0].id,
            type: result.rows[0].type,
            item: result.rows[0].item,
            model: result.rows[0].model,
            detail: result.rows[0].detail,
          },
        });
      },
    );
  }

  static getRequest(req, res) {
    if (isNaN(parseInt(req.params.requestId, 10))) {
      return res.status(400).json({
        message: 'You have entered an invalid request id. A valid request id is a positive integer.',
      });
    }
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    // parse string requestId in url to integer
    const requestId = parseInt(req.params.requestId, 10);

    // query db for user request
    db.query(
      'SELECT * FROM requests WHERE owner = $1 AND id = $2',
      [req.user.email, requestId], (error, result) => {
        if (error) {
          return error;
        }

        if (result.rows < 1) {
          return res.status(200).json({
            message: 'You have no request with that id, please try another request id',
            request: result.rows,
          });
        }

        return res.status(200).json({
          request: result.rows,
        });
      },
    );
  }

  static deleteRequest(req, res) {
    if (isNaN(parseInt(req.params.requestId, 10))) {
      return res.status(400).json({
        message: 'You have entered an invalid request id. A valid request id is a positive integer.',
      });
    }
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    // parse string requestId in url to integer
    const requestId = parseInt(req.params.requestId, 10);

    // delete request from db
    db.query(
      'DELETE FROM requests WHERE id = $1 AND owner = $2 RETURNING *',
      [requestId, req.user.email], (error, result) => {
        if (error) {
          return error;
        }

        if (result.rowCount < 1) {
          return res.status(404).json({
            message: 'The request does not exist, please try another request id',
          });
        }

        res.status(200).json({ message: 'The request was succesfully deleted' });
      },
    );
  }

  static updateRequest(req, res) {
    if (isNaN(parseInt(req.params.requestId, 10))) {
      return res.status(400).json({
        message: 'You have entered an invalid request id. A valid request id is a positive integer.',
      });
    }
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    // parse string requestId in url to integer
    const requestId = parseInt(req.params.requestId, 10);

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
        requestId, req.user.email, 'pending',
      ],
      (error, result) => {
        if (error) {
          return error;
        }

        if (result.rowCount < 1) {
          return res.status(404).json({
            message: `You have no unapproved request with id ${req.params.requestId}. You cannot edit a request that has been approved.`,
          });
        }

        res.status(200).json({
          message: 'You have successfully updated the request',
          request: result.rows[0],
        });
      },
    );
  }


  // Admin
  static getAllRequests(req, res) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    // check if user is admin
    if (tokenValidator.validateAdmin(req.user, res) === false) {
      return res.status(401).json({
        error: 'Are you trying to go where you should not? You need admin access to see what goes on here.',
      });
    }

    // query db for all requests, ordering by id
    db.query('SELECT * FROM requests ORDER BY id ASC', (error, result) => {
      if (error) {
        return error;
      }

      if (result.rows < 1) {
        return res.status(200).json({
          message: 'There are no requests in the system. Do we even have people using this app?',
          request: result.rows,
        });
      }

      return res.status(200).json(result.rows);
    });
  }

  static approveRequest(req, res, next) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    if (tokenValidator.validateAdmin(req.user, res) !== true) {
      return res.status(401).json({
        error: 'Are you trying to go where you should not? You need admin access to see what goes on here.',
      });
    }

    if (isNaN(parseInt(req.params.requestId, 10))) {
      return res.status(400).json({
        message: 'You have entered an invalid request id. A valid request id is a positive integer.',
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
            message: 'The request you\'re looking for does not exist',
          });
        }

        return res.status(200).json({
          message: 'The request was successfully approved. Time to get to work!',
        });
      },
    );
  }

  static disapproveRequest(req, res, next) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    if (tokenValidator.validateAdmin(req.user, res) !== true) {
      return res.status(401).json({
        error: 'Are you trying to go where you should not? You need admin access to see what goes on here.',
      });
    }

    if (isNaN(parseInt(req.params.requestId, 10))) {
      return res.status(400).json({
        message: 'You have entered an invalid request id. A valid request id is a positive integer.',
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
            message: 'The request you\'re looking for does not exist',
          });
        }

        return res.status(200).json({
          message: 'The request was successfully disapproved',
        });
      },
    );
  }

  static resolveRequest(req, res, next) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    if (tokenValidator.validateAdmin(req.user, res) !== true) {
      return res.status(401).json({
        error: 'Are you trying to go where you should not? You need admin access to see what goes on here.',
      });
    }

    if (isNaN(parseInt(req.params.requestId, 10))) {
      return res.status(400).json({
        message: 'You have entered an invalid request id. A valid request id is a positive integer.',
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
            message: 'The request you\'re looking for does not exist',
          });
        }

        return res.status(200).json({
          message: 'Yay! The request was resolved successfully',
        });
      },
    );
  }

  static getARequest(req, res) {
    // check for presence of access token in header and validate
    tokenValidator.validateToken(req.headers.authorization, req, res);

    if (tokenValidator.validateAdmin(req.user, res) !== true) {
      return res.status(401).json({
        error: 'Are you trying to go where you should not? You need admin access to see what goes on here.',
      });
    }

    if (isNaN(parseInt(req.params.requestId, 10))) {
      return res.status(400).json({
        message: 'You have entered an invalid request id. A valid request id is a positive integer.',
      });
    }

    // parse string requestId in url to integer
    const requestId = parseInt(req.params.requestId, 10);
    if (typeof requestId !== 'number') {
      return res.status(400).json({ error: 'You have entered an invalid request id' });
    }

    // query db for user request
    db.query(
      'SELECT * FROM requests WHERE id = $1',
      [requestId], (error, result) => {
        if (error) {
          return error;
        }

        if (result.rows < 1) {
          return res.status(410).json({
            message: 'There is no request with that id in the database. It may have been deleted.',
            request: result.rows,
          });
        }

        return res.status(200).json({
          request: result.rows[0],
        });
      },
    );
  }
}
