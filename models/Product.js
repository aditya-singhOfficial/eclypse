// models/Product.js
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    url: {type: String, required: true},
    public_id: {type: String, required: true}
});

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String},
    price: {type: Number, required: true},
    category: {type: mongoose.Types.ObjectId, ref: 'Category', required: true},
    images: [imageSchema],
    createdBy: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
}, {timestamps: true});

export default mongoose.models.Product
|| mongoose.model('Product', productSchema);
