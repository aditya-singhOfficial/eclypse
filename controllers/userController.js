// controllers/userController.js
import * as userService from '../services/userService.js';

export const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.json(user);
    } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.user.id, req.body);
        res.json(user);
    } catch (err) { next(err); }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (err) { next(err); }
};

export const updateUserByAdmin = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) { next(err); }
};
