// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
    user:    { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    rating:  { type: Number, min:1, max:5, required: true },
    comment: { type: String }
}, { timestamps: true });

export default mongoose.models.Review
|| mongoose.model('Review', reviewSchema);
