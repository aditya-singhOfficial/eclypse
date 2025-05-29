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

export const listMyOrders = async (req, res, next) => {
    try {
        res.json(await orderSvc.fetchUserOrders(req.user.id));
    } catch (err) {
        next(err);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        res.json(await orderSvc.fetchOrderById(req.params.id));
    } catch (err) {
        next(err);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        res.json(await orderSvc.updateOrderStatus(req.params.id, req.body.status));
    } catch (err) {
        next(err);
    }
};

export const deleteOrder = async (req, res, next) => {
    try {
        await orderSvc.deleteOrder(req.params.id);
        res.json({});
    } catch (err) {
        next(err);
    }
};
