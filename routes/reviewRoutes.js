// routes/reviewRoutes.js
import express from 'express';
import {addReview, deleteReview, getReviews} from '../controllers/reviewController.js';
import {authorize, protect} from '../middlewares/auth.js';

const router = express.Router({mergeParams: true});

// Public
router.get('/', getReviews);

// Protected
router.post('/', protect, addReview);

// Admin only
router.delete('/:id', protect, authorize('admin'), deleteReview);

export default router;
