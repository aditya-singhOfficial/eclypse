// routes/userRoutes.js
import express from 'express';
import {
    deleteUser,
    getProfile,
    getUser,
    getUsers,
    updateProfile,
    updateUserByAdmin,
    assignAdminRole,
    revokeAdminRole
} from '../controllers/userController.js';
import {authorize, protect} from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

// User profile routes (accessible to authenticated users)
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Admin-only user management routes
router.use(authorize('admin'));
router.get('/', getUsers);
router.get('/:userId', getUser);
router.put('/:userId', updateUserByAdmin);
router.delete('/:userId', deleteUser);
router.put('/:userId/assign-admin', assignAdminRole);
router.put('/:userId/revoke-admin', revokeAdminRole);

export default router;
