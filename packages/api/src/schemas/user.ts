import { Schema } from 'express-validator';

const create: Schema = {
  name: {
    isString: {
      errorMessage: 'Name must be a string',
    },
    isLength: {
      errorMessage: 'Name is required',
      options: { min: 1 },
    },
  },
  email: {
    isEmail: {
      bail: true,
    },
  },
  password: {
    isLength: {
      errorMessage: 'Password must contain a maximum of 255 characters and a minimum of 8 characters',
      options: { max: 255, min: 6 },
    },
  },
};

const login: Schema = {
  email: {
    isEmail: {
      bail: true,
    },
  },
  password: {
    isLength: {
      errorMessage: 'Password must contain a maximum of 255 characters and a minimum of 8 characters',
      options: { max: 255, min: 6 },
    },
  },
};

export { create, login };
