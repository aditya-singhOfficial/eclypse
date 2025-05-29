// services/reviewService.js
import Review from '../models/Review.js';

export const addReview = data => Review.create(data);
export const fetchReviewsForProduct = productId => Review.find({product: productId}).populate('user', 'name');
export const deleteReview = id => Review.findByIdAndDelete(id);
