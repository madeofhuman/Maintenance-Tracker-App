import bcrypt from 'bcrypt';
import Request from '../models/request';
import { validateRequest } from '../helpers/validators';
import db from '../database';


export default class RequestController {
  static getRequests(req, res, next) {
    db.query('SELECT * FROM requests', (error, result) => {
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
    const {
      type, item, model, detail,
    } = req.body;

    const validationResult = validateRequest(req.body);

    if (validationResult === 'typeError') {
      return res.status(400).json({
        error: 'You supplied an invalid request type. A request can only be \'maintenance\' or \'repair\'',
      });
    }

    if (validationResult === 'itemError') {
      return res.status(400).json({
        error: 'You supplied an invalid item. An item must be a string of more than three characters.',
      });
    }

    if (validationResult === 'detailError') {
      return res.status(400).json({
        error: 'Please enter a description of the error that is more than ten characters',
      });
    }

    if (validationResult === 'modelError') {
      return res.status(400).json({
        error: 'Please enter a valid model. A valid model is more than 2 characters',
      });
    }

    const status = 'pending';

    const request = new Request(type, item, model, detail, status, '');
    request.status = status;

    db.query('INSERT INTO requests (type, item, model, detail, status, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [request.type, request.item, request.model, request.detail, request.status, 'NOW()'], (error, result) => {
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
    const requestId = parseInt(req.params.requestId, 10);

    if (typeof requestId !== 'number') {
      return res.status(400).json({ error: 'You have entered an invalid request id' });
    }

    db.query('SELECT * FROM requests WHERE id = $1', [requestId], (error, result) => {
      if (error) {
        return next(error);
      }

      if (result.rows < 1) {
        return res.status(404).json({ message: 'There is no result with that id' });
      }

      return res.status(200).json(result.rows);
    });
  }

  static deleteRequest(req, res, next) {
    const requestId = parseInt(req.params.requestId, 10);

    if (typeof requestId !== 'number') {
      return res.status(400).json({ message: 'You have entered an invalid request id. A valid request id is a positive integer.' });
    }

    db.query('DELETE FROM requests WHERE id = $1', [requestId], (error) => {
      if (error) {
        return next(error);
      }

      res.status(200).json({ message: 'The request was succesfully deleted' });
    });
  }

  static updateRequest(req, res, next) {
    const requestId = parseInt(req.params.requestId, 10);

    if (typeof requestId !== 'number') {
      return res.status(400).json({ error: 'You have entered an invalid request id' });
    }

    const validationResult = validateRequest(req.body);

    if (validationResult === 'typeError') {
      return res.status(400).json({
        error: 'You supplied an invalid request type. A request can only be \'maintenance\' or \'repair\'',
      });
    }

    if (validationResult === 'itemError') {
      return res.status(400).json({
        error: 'You supplied an invalid item. An item must be a string of more than three characters.',
      });
    }

    if (validationResult === 'detailError') {
      return res.status(400).json({
        error: 'Please enter a description of the error that is more than ten characters',
      });
    }

    if (validationResult === 'modelError') {
      return res.status(400).json({
        error: 'Please enter a valid model. A valid model is more than 2 characters',
      });
    }

    db.query('UPDATE requests SET type = $1, item = $2, model = $3, detail = $4, updated_at = $5 WHERE id = $6', [req.body.type, req.body.item, req.body.model, req.body.detail, 'NOW()', req.params.id], (error, result) => {
      if (error) {
        console.log(error);
        return next(error);
      }

      if (result.rowCount < 1) {
        return res.status(500).json({ message: 'The request was unable to be completed at the moment, please try again later' });
      }

      res.status(200).json({ message: 'You have successfully updated the request' });
    });
  }
}
