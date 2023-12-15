
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import businessRoutes from './routes/businessRoutes';
import tokenRoutes from './routes/tokenRoutes';
import usdcRoutes from './routes/usdcRoutes';
import {connect } from './config/database'

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/usdc', usdcRoutes); 



connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

