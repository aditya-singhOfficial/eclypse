// controllers/authController.js
import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
    try {
        const {user, token} = await authService.register(req.body);
        res.status(201).json({user, token});
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const {user, token} = await authService.login(req.body);
        res.json({user, token});
    } catch (err) {
        next(err);
    }
};
