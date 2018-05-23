import Request from '../models/request';
import { validateRequest } from '../helpers/validators';
import { requests } from '../database';

export default class RequestController {
  static getRequests(req, res) {
    if (requests.length < 1) {
      return res.status(404).json({ error: 'You have no requests' });
    }

    return res.status(200).json(requests);
  }

  static createRequest(req, res) {
    const id = requests.length > 0 ? requests[requests.length - 1].id + 1 : requests.length + 1;

    const {
      type, item, model, detail,
    } = req.body;

    const validationResult = validateRequest(req.body);

    if (validationResult === 'typeError') {
      return res.status(400).send({
        error: 'You supplied an invalid request type. A request can only be \'maintenance\' or \'repair\'',
      });
    }

    if (validationResult === 'itemError') {
      return res.status(400).send({
        error: 'You supplied an invalid item. An item must be a string of more than three characters.',
      });
    }

    if (validationResult === 'detailError') {
      return res.status(400).send({
        error: 'Please enter a description of the error that is more than ten characters',
      });
    }

    if (validationResult === 'modelError') {
      return res.status(400).send({
        error: 'Please enter a valid model. A valid model is more than 2 characters',
      });
    }

    const request = new Request(id, type, item, model, detail);

    requests.push(request);
    return res.status(201).send({
      request,
      location: `/api/v1/users/requests/${id}`,
    });
  }

  static getRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);

    if (typeof requestId !== 'number') {
      return res.status(400).json({ error: 'You have entered an invalid request id' });
    }

    const result = requests.find(request => request.id === requestId);

    if (result === undefined) {
      return res.status(404).json({ error: 'There is no request with that id' });
    }

    return res.status(200).json(result);
  }

  static deleteRequest(req, res) {
    const request = Requests.find(r => r.id === parseInt(req.params.requestId, 10));
    console.log(request);

    if (!request) {
      return res.status(404).json({ error: 'The request with the given id was not found' });
    }

    const index = Requests.indexOf(request);
    Requests.splice(index, 1);

    return res.status(202).json(request);
  }

  static updateRequest(req, res) {
    const request = Requests.find(r => r.id === parseInt(req.params.requestId, 10));

    if (request === undefined) {
      return res.status(404).json({ error: 'There is no request with that id in the dataase' });
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

    request.type = req.body.type;
    request.item = req.body.item;
    request.model = req.body.model;
    request.detail = req.body.detail;
    return res.status(200).json({
      message: `request ${request.id} was successfully updated!`,
    });
  }
}
