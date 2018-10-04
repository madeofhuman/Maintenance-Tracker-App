import dotenv from 'dotenv';
import Request from '../models/Request';
import { db } from '../database';
import { apiResponses } from '../helpers/apiResponses';

dotenv.config();

export default class RequestController {
  static getRequests(req, res) {
    // query db for user requests ordering by id
    db.query(
      'SELECT * FROM requests WHERE owner = $1 ORDER BY created_at DESC',
      [req.user.email],
    )
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json(apiResponses.request.noRequests());
        }
        return res.status(200).json(apiResponses.request.yesRequests(result));
      })
      .catch(() => res.status(500).json(apiResponses['500']));
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
          return res.status(500).json(apiResponses['500']);
        }
        return res.status(201).json(apiResponses.request.createSuccess(result));
      })
      .catch((error) => {
        console.error('Error ', error.stack);
        res.status(500).json(apiResponses['500']);
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
          return res.status(200).json(apiResponses.request.noRequest());
        }
        return res.status(200).json(apiResponses.request.yesRequest(result));
      })
      .catch(() => res.status(500).json(apiResponses['500']));
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
          return res.status(200).json(apiResponses.request.noRequest());
        }
        res.status(200).json(apiResponses.request.deleteSuccess());
      })
      .catch(() => res.status(500).json(apiResponses['500']));
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
          return res.status(200).json(apiResponses.request.updateFailure(req));
        }
        return res.status(200).json(apiResponses.request.updateSuccess(result));
      })
      .catch(() => res.status(500).json(apiResponses['500']));
  }


  // Admin
  static getAllRequests(req, res) {
    // query db for all requests, ordering by id
    db.query('SELECT * FROM requests ORDER BY created_at DESC')
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json(apiResponses.admin.noRequests());
        }
        return res.status(200).json(apiResponses.admin.yesRequests(result));
      })
      .catch(() => res.status(500).json(apiResponses['500']));
  }

  static approveRequest(req, res) {
    db.query(
      'UPDATE requests SET status = $1 where id = $2 and status = $3 RETURNING *',
      ['pending', req.params.requestId, 'in-review'],
    )
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json(apiResponses.admin.approveFailure());
        }
        return res.status(200).json(apiResponses.admin.approveSuccess(result));
      })
      .catch(() => res.status(500).json(apiResponses['500']));
  }

  static disapproveRequest(req, res) {
    db.query(
      'UPDATE requests SET status = $1 where id = $2 and status not like $3 RETURNING *',
      ['disapproved', req.params.requestId, '%resolved%'],
    )
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json(apiResponses.admin.disapproveFailure());
        }
        return res.status(200).json(apiResponses.admin.disapproveSuccess(result));
      })
      .catch(() => res.status(500).json(apiResponses['500']));
  }

  static resolveRequest(req, res) {
    db.query(
      'UPDATE requests SET status = $1 where id = $2 and status = $3 RETURNING *',
      ['resolved', req.params.requestId, 'pending'],
    )
      .then((result) => {
        if (result.rows < 1) {
          return res.status(200).json(apiResponses.admin.resolveFailure());
        }
        return res.status(200).json(apiResponses.admin.resolveSuccess(result));
      })
      .catch(() => res.status(500).json(apiResponses['500']));
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
          return res.status(200).json(apiResponses.admin.noRequest());
        }
        return res.status(200).json(apiResponses.admin.yesRequest(result));
      })
      .catch(() => res.status(500).json(apiResponses['500']));
  }
}
