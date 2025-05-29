// controllers/adminController.js
import * as adminService from '../services/adminService.js';

export const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await adminService.getDashboardStatistics();
        res.json(stats);
    } catch (err) {
        next(err);
    }
};

export const getTotalSales = async (req, res, next) => {
    try {
        const totalSales = await adminService.getTotalSales();
        res.json({ totalSales });
    } catch (err) {
        next(err);
    }
};
