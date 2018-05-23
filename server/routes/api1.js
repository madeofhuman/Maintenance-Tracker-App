import express from 'express';
import bodyParser from 'body-parser';
import RequestController from '../controllers/requestController';

const api1 = express.Router();

api1.use(bodyParser.json());

api1.all('/', (req, res) => {
  res.status(200).send({ message: 'Maintenance Tracker Api V1. Please use /users/requests' });
});

api1.get('/users/requests', RequestController.getRequests);
api1.put('/users/requests/:requestId', RequestController.updateRequest);
api1.post('/users/requests', RequestController.createRequest);
api1.get('/users/requests/:requestId', RequestController.getRequest);
api1.delete('/users/requests/:requestId', RequestController.deleteRequest);

export default api1;
