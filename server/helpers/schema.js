import { Joi } from 'celebrate';

export const schema = {
  userSchema: {
    body: {
      firstName: Joi.string().regex(/^[A-z]*$/g).max(20).required()
        .error(new Error('A first name can only be a word that is less than 21 characters.')),
      lastName: Joi.string().regex(/^[A-z]*$/).max(20).required()
        .error(new Error('A last name can only be a word that is less than 21 characters.')),
      email: Joi.string().email({ minDomainAtoms: 2 }).max(30).required()
        .error(new Error('Please enter a valid email that is less than 31 characters.')),
      password: Joi.string().regex(/^[A-z0-9.'-]{5,12}$/).required()
        .error(new Error('A password can only contain alphabets, numbers, ' +
        'hyphens, apostrophes, commas, and periods, and is between 5 and 21 characters,')),
    },
  },
  loginSchema: {
    body: {
      email: Joi.string().email({ minDomainAtoms: 2 }).max(30).required()
        .error(new Error('Please enter a valid email that is less than 31 characters.')),
      password: Joi.string().regex(/^[A-z0-9.'-]{5,12}$/).required()
        .error(new Error('A password can only contain alphabets, numbers, ' +
        'hyphens, apostrophes, commas, and periods, and is between 5 and 21 characters,')),
    },
  },
  requestSchema: {
    body: Joi.object({
      type: Joi.string().alphanum().valid(['repair', 'maintenance']).required()
        .error(new Error('A request type can only be \'maintenance\' or \'repair\'')),
      item: Joi.string().regex(/^[A-z0-9 -]+$/).max(30).required()
        .error(new Error('An item can only contain alphabets, numbers, and' +
        'hyphens, and is less than 31 characters,')),
      model: Joi.string().regex(/^[A-z0-9., -/]+$/).default('N/A').max(30)
        .error(new Error('A model can only contain alphabets, numbers, ' +
        'hyphens, a forward slash, apostrophes, commas, and periods, and is less than 31 characters,')),
      detail: Joi.string().regex(/^[A-z0-9., '-]+$/).max(140).required()
        .error(new Error('A detail can only contain alphabets, numbers, ' +
        'hyphens, apostrophes, commas, and periods, and is not more than 140 characters,')),
    }),
    headers: Joi.object({
      authorization: Joi.string().required()
        .error(new Error('You have to be logged in to use the application.')),
    }).unknown(),
    params: Joi.object({
      requestId: Joi.number()
        .error(new Error('You entered an invalid request id. ' +
        'A request id can only be a positive integer.')),
    }),
  },
  requestIdSchema: {
    params: Joi.object({
      requestId: Joi.number()
        .error(new Error('You entered an invalid request id. ' +
        'A request id can only be a positive integer.')),
    }),
  },
  jwtTokenSchema: {
    headers: Joi.object({
      authorization: Joi.string().required()
        .error(new Error('You have to be logged in to use the application.')),
    }).unknown(),
  },
};
