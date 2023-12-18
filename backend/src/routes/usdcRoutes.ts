import express from 'express';
import { getUsdcBalance } from '../controllers/usdcController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/usdc-balance/:address', authenticateToken, getUsdcBalance);

export default router;
