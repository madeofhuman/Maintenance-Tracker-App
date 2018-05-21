import { Requests } from '../database';

export default class RequestController {
  static getRequests(req, res) {
    if (Requests.length < 1) {
      return res.status(404).json({ error: 'You have no requests' });
    }

    return res.status(200).json(Requests);
  }
}
