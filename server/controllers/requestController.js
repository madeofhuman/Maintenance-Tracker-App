import { Requests } from '../database';

export default class RequestController {
  static getRequests(req, res) {
    if (Requests.length < 1) {
      return res.status(404).json({ error: 'You have no requests' });
    }

    return res.status(200).json(Requests);
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
}
