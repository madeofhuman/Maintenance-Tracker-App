import { Requests } from '../database';
import { validateRequest } from '../helpers/validators';

export default class RequestController {
  static getRequests(req, res) {
    if (Requests.length < 1) {
      return res.status(404).json({ error: 'You have no requests' });
    }

    return res.status(200).json(Requests);
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
