import dotenv from 'dotenv';
import Request from '../models/Request';
import { db } from '../database';

dotenv.config();

export default class RequestController {
  static getRequests(req, res) {
    // query db for user requests ordering by id
    db.query(
      'SELECT * FROM requests WHERE owner = $1 ORDER BY id ASC',
      [req.user.email],
    )
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json({
            statusCode: 200,
            error: [],
            message: 'You have no requests at the moment. ' +
            'Do you have any item that needs fixing? We love fixing stuff!',
            result: [],
          });
        }
        return res.status(200).json({
          statusCode: 200,
          error: [],
          message: 'Your requests were succesfully retrieved',
          result: result.rows,
        });
      })
      .catch(() => res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oops! Another bug must have crawled into our systems, ' +
          'but we are right on it! Please try your request later :\'(',
      }));
  }

  static createRequest(req, res) {
    // set auto-generated fields and create request object
    const owner = req.user.email;
    const request = new Request(
      req.body.type, req.body.item, req.body.model,
      req.body.detail, owner,
    );

    // save valid request to db
    db.query(
      `INSERT INTO requests (type, item, model, detail, status, owner, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        request.type, request.item, request.model,
        request.detail, request.status, request.owner, 'NOW()',
      ],
    )
      .then((result) => {
        if (result.rowCount < 1) {
          return res.status(500).json({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Oops! Another bug must have crawled into our systems, ' +
            'but we are right on it! Please try your request later :\'(',
          });
        }

        return res.status(201).json({
          statusCode: 201,
          error: [],
          message: 'Yay! Your request was successfuly created and is pending admin approval.',
          result: {
            id: result.rows[0].id,
            type: result.rows[0].type,
            item: result.rows[0].item,
            model: result.rows[0].model,
            detail: result.rows[0].detail,
            createdAt: result.rows[0].created_at,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Oops! Another bug must have crawled into our systems, ' +
          'but we are right on it! Please try your request later :\'(',
        });
        console.error('Error ', error.stack);
      });
  }

  static getRequest(req, res) {
    // get the request id
    const { requestId } = req.params;

    // query db for user request
    db.query(
      'SELECT * FROM requests WHERE owner = $1 AND id = $2',
      [req.user.email, requestId],
    )
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json({
            statusCode: 200,
            error: [],
            message: 'You have no request with that id, please try another request id',
            result: result.rows,
          });
        }

        return res.status(200).json({
          statusCode: 200,
          error: [],
          message: 'Your request was successfully retrieved',
          result: result.rows[0],
        });
      })
      .catch(() => res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oops! Another bug must have crawled into our systems, ' +
          'but we are right on it! Please try your request later :\'(',
      }));
  }

  static deleteRequest(req, res) {
    // parse string requestId in url to integer
    const { requestId } = req.params;

    // delete request from db
    db.query(
      'DELETE FROM requests WHERE id = $1 AND owner = $2 RETURNING *',
      [requestId, req.user.email],
    )
      .then((result) => {
        if (result.rowCount < 1) {
          return res.status(404).json({
            statusCode: 404,
            error: [],
            message: 'You have no request with that id, please try another request id',
          });
        }

        res.status(200).json({
          statusCode: 200,
          error: [],
          message: 'The request was succesfully deleted',
        });
      })
      .catch(() => res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oops! Another bug must have crawled into our systems, ' +
        'but we are right on it! Please try your request later :\'(',
      }));
  }

  static updateRequest(req, res) {
    // extract request id and request data
    const { requestId } = req.params;
    const {
      type, item, model, detail,
    } = req.body;

    // db query to update request only if the reques status isn't pending
    db.query(
      `UPDATE requests SET type = $1, item = $2, model = $3, detail = $4, updated_at = $5 
      WHERE id = $6 and owner = $7 and status = $8 RETURNING *`,
      [
        type, item, model, detail, 'NOW()',
        requestId, req.user.email, 'in-review',
      ],
    )
      .then((result) => {
        if (result.rowCount < 1) {
          return res.status(404).json({
            statusCode: 200,
            error: [],
            message: `You have no unapproved request with id ${req.params.requestId}. ` +
            'You cannot edit a request that has been approved.',
          });
        }

        res.status(200).json({
          statusCode: 200,
          error: [],
          message: 'You have successfully updated the request',
          result: {
            id: result.rows[0].id,
            type: result.rows[0].type,
            item: result.rows[0].item,
            model: result.rows[0].model,
            detail: result.rows[0].detail,
            createdAt: result.rows[0].created_at,
            updatedAt: result.rows[0].updated_at,
          },
        });
      })
      .catch(() => res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oops! Another bug must have crawled into our systems, ' +
        'but we are right on it! Please try your request later :\'(',
      }));
  }


  // Admin
  static getAllRequests(req, res) {
    // query db for all requests, ordering by id
    db.query('SELECT * FROM requests ORDER BY id ASC')
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json({
            statusCode: 200,
            error: [],
            message: 'There are no requests in the system. Do we even have people using this app?',
            result: [],
          });
        }

        return res.status(200).json({
          statusCode: 200,
          error: [],
          message: 'Requests retrieved successfully.',
          result: result.rows,
        });
      })
      .catch(() => res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oops! Another bug must have crawled into our systems, ' +
        'but we are right on it! Please try your request later :\'(',
      }));
  }

  static approveRequest(req, res) {
    db.query(
      'UPDATE requests SET status = $1 where id = $2 and status = $3 RETURNING *',
      ['pending', req.params.requestId, 'in-review'],
    )
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json({
            statusCode: 200,
            error: [],
            message: 'There is no request in review with that id. Please try another request id.',
          });
        }

        return res.status(200).json({
          statusCode: 200,
          error: [],
          message: 'The request was successfully approved. Time to get to work!',
        });
      })
      .catch(() => res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oops! Another bug must have crawled into our systems, ' +
        'but we are right on it! Please try your request later :\'(',
      }));
  }

  static disapproveRequest(req, res) {
    db.query(
      'UPDATE requests SET status = $1 where id = $2 and status not like $3 RETURNING *',
      ['disapproved', req.params.requestId, '%resolved%'],
    )
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json({
            statusCode: 200,
            error: [],
            message: 'There is no unresolved request with that id. Please try another request id.',
          });
        }

        return res.status(200).json({
          statusCode: 200,
          error: [],
          message: 'The request was successfully disapproved',
        });
      })
      .catch(() => res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oops! Another bug must have crawled into our systems, ' +
        'but we are right on it! Please try your request later :\'(',
      }));
  }

  static resolveRequest(req, res) {
    db.query(
      'UPDATE requests SET status = $1 where id = $2 and status = $3 RETURNING *',
      ['resolved', req.params.requestId, 'pending'],
    )
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json({
            statusCode: 200,
            error: [],
            message: 'There is no pending request with that id. Please try another request id.',
          });
        }

        return res.status(200).json({
          statusCode: 200,
          error: [],
          message: 'Yay! The request was resolved successfully.',
        });
      })
      .catch(() => res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oops! Another bug must have crawled into our systems, ' +
        'but we are right on it! Please try your request later :\'(',
      }));
  }

  static getARequest(req, res) {
    const { requestId } = req.params;

    // query db for user request
    db.query(
      'SELECT * FROM requests WHERE id = $1',
      [requestId],
    )
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json({
            statusCode: 200,
            error: [],
            message: 'There is no request with that id. Please try another request id.',
          });
        }

        return res.status(200).json({
          statusCode: 200,
          error: [],
          message: 'The request was successfully retrieved',
          result: result.rows[0],
        });
      })
      .catch(() => res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Oops! Another bug must have crawled into our systems, ' +
        'but we are right on it! Please try your request later :\'(',
      }));
  }
}
