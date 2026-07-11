import express from 'express';
import cors from 'cors';

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';
import alumnoRoutes from './routes/alumno.routes';
import cursoRoutes from './routes/curso.routes';
import rolEmpresaRoutes from './routes/rol-empresa.routes';
import empresaRoutes from './routes/empresa.routes';
import docenteRoutes from './routes/docente.routes';

import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', healthRoutes);
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/alumnos', alumnoRoutes);
app.use('/cursos', cursoRoutes);
app.use('/roles-empresa', rolEmpresaRoutes);
app.use('/empresas', empresaRoutes);
app.use('/docentes', docenteRoutes);

if (process.env.ENVIRONMENT === 'development') {
  import('./docs/scalar').then(({ default: scalarDocs }) => {
    app.use('/docs', scalarDocs);
  });
}

app.use(errorMiddleware);

export default app;
