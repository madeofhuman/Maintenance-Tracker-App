import { Joi } from 'celebrate';

export const schema = {
  userSchema: {
    body: {
      firstName: Joi.string().alphanum().max(20).required()
        .error(() => 'you entered an invalid first name. ' +
        'A first name is a string that is less than 20 characters.'),
      lastName: Joi.string().alphanum().max(20).required()
        .error(() => 'you entered an invalid last name. ' +
        'A last name is a string that is less than 20 characters.'),
      email: Joi.string().email({ minDomainAtoms: 2 }).max(30).required()
        .error(() => 'you entered an invalid email address. ' +
        'Please enter a valid email that is less than 21 characters.'),
      password: Joi.string().regex(/^[A-z0-9]{5,12}$/).required()
        .error(() => 'you entered an invalid password. ' +
        'A valid password can only contain letters and numbers, ' +
        'is greater than 4 characters and less than 13 characters'),
    },
  },
  loginSchema: {
    body: {
      email: Joi.string().email({ minDomainAtoms: 2 }).max(30).required()
        .error(() => 'you entered an invalid email address. ' +
        'Please enter a valid email that is less than 21 characters.'),
      password: Joi.string().regex(/^[A-z0-9]{5,12}$/).required()
        .error(() => 'you entered an invalid password. ' +
        'A valid password can only contain letters and numbers, ' +
        'is greater than 4 characters, and less than 13 characters'),
    },
  },
  requestSchema: {
    body: Joi.object({
      type: Joi.string().alphanum().valid(['repair', 'maintenance']).required()
        .error(() => 'you entered an invalid request type. ' +
        'A request type can only be \'maintenance\' or \'repair\''),
      item: Joi.string().alphanum().max(20).required()
        .error(() => 'you entered an invalid item. ' +
        'An item is an alphanumeric string no longer than 20 characters'),
      model: Joi.string().regex(/^[A-z0-9-]+$/).max(15).default('N/A'),
      detail: Joi.string().regex(/^[A-z0-9 ,.-]+$/).max(140).required(),
    }),
    headers: Joi.object({
      authorization: Joi.string().required()
        .error(() => 'you have to be logged in to use the application.'),
    }).unknown(),
    params: Joi.object({
      requestId: Joi.number()
        .error(() => 'you entered an invalid request id. ' +
        'A request id can only be a positive integer.'),
    }),
  },
  requestIdSchema: {
    params: Joi.object({
      requestId: Joi.number()
        .error(() => 'you entered an invalid request id. ' +
        'A request id can only be a positive integer.'),
    }),
  },
  jwtTokenSchema: {
    headers: Joi.object({
      authorization: Joi.string().required()
        .error(() => 'you have to be logged in to use the application.'),
    }).unknown(),
  },
};
