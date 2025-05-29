// routes/authRoutes.js
import express from 'express';
import {login, register, getAdminMe} from '../controllers/authController.js';
import {protect} from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Admin authentication routes
router.get('/admin/me', protect, getAdminMe);

export default router;
