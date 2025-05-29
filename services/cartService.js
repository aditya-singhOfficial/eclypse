// services/cartService.js
import Cart from '../models/Cart.js';

export const getCartByUser = userId =>
    Cart.findOne({ user: userId }).populate('items.product');

export const addToCart = async (userId, productId, qty=1) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    const item = cart.items.find(i => i.product.equals(productId));
    if (item) item.quantity += qty;
    else cart.items.push({ product: productId, quantity: qty });

    return cart.save();
};

export const updateCartItem = (userId, itemId, qty) =>
    Cart.findOneAndUpdate(
        { user: userId, 'items._id': itemId },
        { $set: { 'items.$.quantity': qty }},
        { new: true }
    );

export const removeCartItem = (userId, itemId) =>
    Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { _id: itemId }}},
        { new: true }
    );

export const clearCart = userId =>
    Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] }},
        { new: true }
    );
