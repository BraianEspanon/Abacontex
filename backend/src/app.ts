import express from 'express';
import cors from 'cors';

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';
import alumnoRoutes from './routes/alumno.routes';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', healthRoutes);
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/alumnos', alumnoRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
