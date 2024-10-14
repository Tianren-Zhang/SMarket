const { body } = require('express-validator');

const validateAddress = (isUpdate = false) => {
  return [
    body('addressLine1')
      .if((value, { req }) => !isUpdate || req.body.addressLine1)
      .trim()
      .notEmpty()
      .withMessage('addressLine1 is required')
      .isString()
      .withMessage('addressLine1 must be a string'),

    body('addressLine2')
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage('addressLine2 must be a string'),

    body('city')
      .if((value, { req }) => !isUpdate || req.body.city)
      .trim()
      .notEmpty()
      .withMessage('city is required')
      .isString()
      .withMessage('city must be a string'),

    body('state')
      .if((value, { req }) => !isUpdate || req.body.state)
      .trim()
      .notEmpty()
      .withMessage('state is required')
      .isString()
      .withMessage('state must be a string'),

    body('zipCode')
      .if((value, { req }) => !isUpdate || req.body.zipCode)
      .trim()
      .notEmpty()
      .withMessage('zipCode is required')
      .isString()
      .withMessage('zipCode must be a string'),

    body('country')
      .if((value, { req }) => !isUpdate || req.body.country)
      .trim()
      .notEmpty()
      .withMessage('country is required')
      .isString()
      .withMessage('country must be a string'),

    body('addressType')
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage('addressType must be a string'),
  ];
};

module.exports = validateAddress;
