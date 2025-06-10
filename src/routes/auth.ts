import { Router } from "express"
import { getProfile, login, register } from "../controllers/authController";
import { authenticate } from "../middleware/auth";


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

export default router;