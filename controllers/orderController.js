// controllers/orderController.js
import * as orderSvc from '../services/orderService.js';

export const createOrder = async (req, res, next) => {
    try {
        res.status(201).json(await orderSvc.createOrder(req.user.id, req.body.paymentInfo));
    } catch (err) {
        next(err);
    }
};

export const listOrders = async (_, res, next) => {
    try {
        res.json(await orderSvc.fetchOrders());
    } catch (err) {
        next(err);
    }
};

export const getAllOrdersAdmin = async (_, res, next) => {
    try {
        const orders = await orderSvc.fetchOrders();
        res.json({ orders });
    } catch (err) {
        next(err);
    }
};

export const listMyOrders = async (req, res, next) => {
    try {
        res.json(await orderSvc.fetchUserOrders(req.user.id));
    } catch (err) {
        next(err);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await orderSvc.fetchOrderById(req.params.id || req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ order });
    } catch (err) {
        next(err);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const orderId = req.params.id || req.params.orderId;
        const order = await orderSvc.updateOrderStatus(orderId, req.body.orderStatus || req.body.status);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ order });
    } catch (err) {
        next(err);
    }
};

export const markOrderDelivered = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const updateData = {
            status: 'Delivered',
            isDelivered: true,
            deliveredAt: req.body.deliveredAt || new Date().toISOString()
        };
        const order = await orderSvc.markOrderDelivered(orderId, updateData);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ order });
    } catch (err) {
        next(err);
    }
};

export const deleteOrder = async (req, res, next) => {
    try {
        const order = await orderSvc.deleteOrder(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        next(err);
    }
};

export const getMyOrder = async (req, res, next) => {
    try {
        const order = await orderSvc.fetchUserOrderById(req.user.id, req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        next(err);
    }
};
