import * as Joi from 'joi';
export const validationSchema = Joi.object({
  // DATABASE Creds
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  // Contentful Creds
  CONTENTFUL_SPACE_ID: Joi.string().required(),
  CONTENTFUL_ACCESS_TOKEN: Joi.string().required(),
  CONTENTFUL_ENVIRONMENT: Joi.string().default('master'),
  CONTENTFUL_BASE_URL: Joi.string(),
  CONTENTFUL_CONTENT_TYPE: Joi.string(),

  // JWT
  JWT_SECRET: Joi.string().optional(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
});
