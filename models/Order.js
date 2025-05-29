// models/Order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {type: mongoose.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, required: true},
    price: {type: Number, required: true}
});

const orderSchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    items: [orderItemSchema],
    totalPrice: {type: Number, required: true},
    status: {type: String, default: 'pending'},
    paymentInfo: {type: Object}
}, {timestamps: true});

export default mongoose.models.Order
|| mongoose.model('Order', orderSchema);
