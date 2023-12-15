import express from 'express';
import { authenticateUser } from '../controllers/authController';

const router = express.Router();

router.post('/', authenticateUser);

export default router;
