import { Joi } from 'celebrate';

export const schema = {
  userSchema: {
    body: {
      firstName: Joi.string().regex(/[A-z]/).max(20).required()
        .error(() => 'a first name can only contain alphabets, and is less than 21 characters.'),
      lastName: Joi.string().regex(/[A-z]/).max(20).required()
        .error(() => 'a last name can only contain alphabets, and is less than 21 characters.'),
      email: Joi.string().email({ minDomainAtoms: 2 }).max(30).required()
        .error(() => 'please enter a valid email that is less than 31 characters.'),
      password: Joi.string().regex(/^[A-z0-9.'-]{5,12}$/).required()
        .error(() => 'a password can only contain alphabets, numbers, ' +
        'hyphens, apostrophes, commas, and periods, and is less than 21 characters,'),
    },
  },
  loginSchema: {
    body: {
      email: Joi.string().email({ minDomainAtoms: 2 }).max(30).required()
        .error(() => 'please enter a valid email that is less than 31 characters.'),
      password: Joi.string().regex(/^[A-z0-9.'-]{5,12}$/).required()
        .error(() => 'a password can only contain alphabets, numbers, ' +
        'hyphens, apostrophes, commas, and periods, and is less than 21 characters,'),
    },
  },
  requestSchema: {
    body: Joi.object({
      type: Joi.string().alphanum().valid(['repair', 'maintenance']).required()
        .error(() => 'a request type can only be \'maintenance\' or \'repair\''),
      item: Joi.string().regex(/^[A-z0-9 -]+$/).max(30).required()
        .error(() => 'an item can only contain alphabets, numbers, and' +
        'hyphens, and is less than 31 characters,'),
      model: Joi.string().regex(/^[A-z0-9 -/]+$/).default('N/A').max(30)
        .error(() => 'a model can only contain alphabets, numbers, ' +
        'hyphens, and a forward slash, and is less than 31 characters,'),
      detail: Joi.string().regex(/^[A-z0-9 ,.'-]+$/).max(140).required()
        .error(() => 'a detail can only contain alphabets, numbers, ' +
        'hyphens, apostrophes, commas, and periods, and is less than 141 characters,'),
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
