// services/orderService.js
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const createOrder = async (userId, paymentInfo) => {
    const cart = await Cart.findOne({user: userId}).populate('items.product');
    if (!cart || !cart.items.length) throw new Error('Cart empty');

    const items = cart.items.map(i => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price
    }));
    const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    const order = await Order.create({user: userId, items, totalPrice, paymentInfo});
    await Cart.findOneAndUpdate({user: userId}, {items: []});
    return order;
};

export const fetchOrders = () => Order.find().populate('user', 'name email');
export const fetchOrderById = id => Order.findById(id).populate('user', 'name email').populate('items.product');
export const fetchUserOrders = userId => Order.find({user: userId}).populate('items.product').sort({createdAt: -1});
export const fetchUserOrderById = (userId, orderId) => Order.findOne({_id: orderId, user: userId}).populate('items.product');
export const updateOrderStatus = (id, status) =>
    Order.findByIdAndUpdate(id, {status}, {new: true});
export const deleteOrder = id => Order.findByIdAndDelete(id);
