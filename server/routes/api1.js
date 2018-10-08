import express from 'express';
import bodyParser from 'body-parser';
import { celebrate, errors } from 'celebrate';
import RequestController from '../controllers/RequestController';
import UserController from '../controllers/UserController';
import { schema } from '../helpers/schema';
import { tokenValidator } from '../helpers/validators';

const api1 = express.Router();

api1.use(bodyParser.json());

api1.all('/', (req, res) => {
  res.status(200).send({
    statusCode: 200,
    error: [],
    message: 'Maintenance Tracker Api V1. Please use /auth/signup tp create an account, ' +
    '/auth/login to log in, /users/requests/ as a user, or /requests/ as an admin.',
  });
});

api1.get('/users/requests', celebrate(schema.requestSchema), tokenValidator.validateUser, RequestController.getRequests);
api1.put('/users/requests/:requestId', celebrate(schema.requestSchema), tokenValidator.validateUser, RequestController.updateRequest);
api1.post('/users/requests', celebrate(schema.requestSchema), tokenValidator.validateUser, RequestController.createRequest);
api1.get('/users/requests/:requestId', celebrate(schema.requestSchema), tokenValidator.validateUser, RequestController.getRequest);
api1.delete('/users/requests/:requestId', tokenValidator.validateUser, celebrate(schema.requestIdSchema), RequestController.deleteRequest);
api1.post('/auth/signup', celebrate(schema.userSchema), UserController.createUser);
api1.post('/auth/login', celebrate(schema.loginSchema), UserController.userLogin);

// Admin routes
api1.get('/requests', celebrate(schema.jwtTokenSchema), tokenValidator.validateUser, tokenValidator.validateAdmin, RequestController.getAllRequests);
api1.put('/requests/:requestId/approve', celebrate(schema.jwtTokenSchema), tokenValidator.validateUser, tokenValidator.validateAdmin, RequestController.approveRequest);
api1.put('/requests/:requestId/disapprove', celebrate(schema.jwtTokenSchema), tokenValidator.validateUser, tokenValidator.validateAdmin, RequestController.disapproveRequest);
api1.put('/requests/:requestId/resolve', celebrate(schema.jwtTokenSchema), tokenValidator.validateUser, tokenValidator.validateAdmin, RequestController.resolveRequest);
api1.get('/requests/:requestId', celebrate(schema.jwtTokenSchema), celebrate(schema.requestSchema), tokenValidator.validateUser, tokenValidator.validateAdmin, RequestController.getARequest);

api1.use(errors());

export default api1;
