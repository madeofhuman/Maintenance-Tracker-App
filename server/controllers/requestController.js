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
}
