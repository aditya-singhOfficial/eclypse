// controllers/reviewController.js
import * as revSvc from '../services/reviewService.js';

export const addReview = async (req, res, next) => {
    try {
        const data = {product: req.params.id, user: req.user.id, rating: req.body.rating, comment: req.body.comment};
        res.status(201).json(await revSvc.addReview(data));
    } catch (err) {
        next(err);
    }
};

export const getReviews = async (req, res, next) => {
    try {
        res.json(await revSvc.fetchReviewsForProduct(req.params.id));
    } catch (err) {
        next(err);
    }
};

export const deleteReview = async (req, res, next) => {
    try {
        await revSvc.deleteReview(req.params.id);
        res.json({});
    } catch (err) {
        next(err);
    }
};
