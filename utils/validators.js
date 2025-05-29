// utils/validators.js
import {body} from 'express-validator';

export const registerValidator = [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({min: 6})
];

