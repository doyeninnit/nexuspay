import express from 'express';
import { send, pay, tokenTransferEvents } from '../controllers/tokenController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/sendToken', authenticateToken, send);
router.post('/pay', authenticateToken, pay);
router.get('/token-transfer-events', authenticateToken, tokenTransferEvents);

export default router;
