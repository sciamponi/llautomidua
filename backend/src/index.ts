import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

config();

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes placeholders
app.use('/api/auth', (req, res) => res.status(501).json({ message: 'Auth module not implemented' }));
app.use('/api/users', (req, res) => res.status(501).json({ message: 'Users module not implemented' }));
app.use('/api/leads', (req, res) => res.status(501).json({ message: 'Leads module not implemented' }));
app.use('/api/products', (req, res) => res.status(501).json({ message: 'Products module not implemented' }));
app.use('/api/partners', (req, res) => res.status(501).json({ message: 'Partners module not implemented' }));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
