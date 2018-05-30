import express from 'express';
import bodyParser from 'body-parser';
import RequestController from '../controllers/RequestController';
import UserController from '../controllers/UserController';

const api1 = express.Router();

api1.use(bodyParser.json());

api1.all('/', (req, res) => {
  res.status(200).send({ message: 'Maintenance Tracker Api V1. Please use /users/requests as a user, or /requests as an admin' });
});

api1.get('/users/requests', RequestController.getRequests);
api1.put('/users/requests/:requestId', RequestController.updateRequest);
api1.post('/users/requests', RequestController.createRequest);
api1.get('/users/requests/:requestId', RequestController.getRequest);
api1.delete('/users/requests/:requestId', RequestController.deleteRequest);
api1.post('/auth/signup', UserController.createUser);
api1.post('/auth/login', UserController.userLogin);
api1.get('/requests', RequestController.getAllRequests);
api1.put('/requests/:requestId/approve', RequestController.approveRequest);
api1.put('/requests/:requestId/disapprove', RequestController.disapproveRequest);
api1.put('/requests/:requestId/resolve', RequestController.resolveRequest);

export default api1;
