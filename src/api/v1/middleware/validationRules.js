import { body, param } from 'express-validator';


export const createUpdateUserRule = () => [
  body('firstName')
    .exists({ checkFalsy: true }).withMessage('is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('field length min:3, max:50')
    .isAlpha()
    .withMessage('must be alphabetic'),
  body('lastName')
    .exists({ checkFalsy: true }).withMessage('is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('field length min:3, max:50')
    .isAlpha()
    .withMessage('must be alphabetic'),
  body('email')
    .exists({ checkFalsy: true }).withMessage('is required')
    .isEmail()
    .withMessage('invalid email'),
  body('password')
    .exists({ checkFalsy: true }).withMessage('is required')
    .isLength({ min: 8, max: undefined })
    .withMessage('is a minimum of 8 characters'),
  body('jobRole')
    .exists({ checkFalsy: true }).withMessage('is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('field length (min:3 max:50)')
    .isAlphanumeric()
    .withMessage('must be alphanumeric'),
  body('gender')
    .exists({ checkFalsy: true }).withMessage('is required')
    .isIn(['M', 'F'])
    .withMessage('must be either "M" or "F"'),
  body('department')
    .exists({ checkFalsy: true }).withMessage('is required')
    .isAlphanumeric()
    .withMessage('is alphanumeric'),
  body('address')
    .exists({ checkFalsy: true }).withMessage('is required')
    .isLength({ min: 10, max: undefined })
    .withMessage('field length (min:10)'),
];

export const createUpdateArticleRule = () => [
  body('title')
    .exists({ checkFalsy: true }).withMessage('is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('field length min:3, max:100'),
  body('article')
    .exists({ checkFalsy: true }).withMessage('is required')
    .isLength({ min: 10, max: undefined })
    .withMessage('field length min:10'),
  param('articleId')
    .if((value, { req }) => req.method === 'PATCH')
    .exists({ checkFalsy: true }).withMessage('url parameter is required')
    .isInt()
    .withMessage('url parameter must be an integer'),
];

export const deleteArticleRule = () => [
  param('articleId')
    .exists({ checkFalsy: true }).withMessage('url parameter is required')
    .isInt()
    .withMessage('url parameter must be an integer'),
];
