// routes/userRoutes.js
import express from 'express';
import {
    deleteUser,
    getProfile,
    getUser,
    getUsers,
    updateProfile,
    updateUserByAdmin
} from '../controllers/userController.js';
import {authorize, protect} from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getUsers);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.use(authorize('admin'));
router.get('/:id', getUser);
router.put('/:id', updateUserByAdmin);
router.delete('/:id', deleteUser);

export default router;
