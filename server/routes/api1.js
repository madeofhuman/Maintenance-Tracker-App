import express from 'express';
import bodyParser from 'body-parser';
import RequestController from '../controllers/requestController';

const api1 = express.Router();

api1.use(bodyParser.json());

api1.all('/', (req, res) => {
  res.status(200).send({ message: 'Maintenance Tracker Api V1. Please use /users/requests' });
});

api1.get('/users/requests', RequestController.getRequests);

export default api1;