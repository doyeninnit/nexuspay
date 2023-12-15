import express from 'express';
import { getUsdcBalance } from '../controllers/usdcController';

const router = express.Router();

router.get('/usdc-balance/:address', getUsdcBalance);

export default router;
