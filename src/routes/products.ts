import { Router } from "express";
import { addReview, createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productController";
import { authorize } from "../middleware/auth";
import { authenticate } from "../middleware/auth";


const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize('admin'), createProduct);
router.put('/:id', authenticate, authorize('admin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);
router.post('/:id/reviews', authenticate, addReview);


export default router;