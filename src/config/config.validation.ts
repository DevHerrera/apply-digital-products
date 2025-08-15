import * as Joi from 'joi';
export const validationSchema = Joi.object({
  // DATABASE Creds
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  // JWT
  //JWT_SECRET: Joi.string().optional(),
  //JWT_EXPIRES_IN: Joi.string().default('1h'),
  //JWT_REFRESH_SECRET: Joi.string().optional(),
  //JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
});
