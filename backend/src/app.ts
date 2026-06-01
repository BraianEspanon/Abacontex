import express from 'express';
import cors from 'cors';

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', healthRoutes);
app.use('/auth', authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto: ${PORT}`);
});