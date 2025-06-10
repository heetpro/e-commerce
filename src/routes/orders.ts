import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { createOrder, getAllOrders, getOrderById, getOrders, updateOrderStatus } from "../controllers/orderController";


const router = Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/all', authenticate, authorize('admin'), getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, authorize('admin'), updateOrderStatus);

export default router;