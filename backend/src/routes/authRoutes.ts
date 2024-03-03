
// import express from 'express';
// import { loginUser, registerUser } from '../controllers/authController';
// import { authenticateToken } from '../middleware/authMiddleware';
// const router = express.Router();

// router.post('/login', loginUser);
// router.post('/register', registerUser);

// export default router;


import express from 'express';
import { loginUser, registerUser, initiateRegisterUser } from '../controllers/authController';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register/initiate', initiateRegisterUser); // Step 1: Send OTP
router.post('/register', registerUser); // Step 2: Verify OTP and complete registration

export default router;
