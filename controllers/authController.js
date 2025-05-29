// controllers/authController.js
import * as authService from '../services/authService.js';
import * as userService from '../services/userServices.js';

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

export const getAdminMe = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        res.json({ user });
    } catch (err) {
        next(err);
    }
};
