import express from 'express';
import cors from 'cors';

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';
import alumnoRoutes from './routes/alumno.routes';
import empresaRoutes from './routes/empresa.routes';
import docenteRoutes from './routes/docente.routes';
import productoRoutes from './routes/producto.routes';
import pedidoRoutes from './routes/pedido.routes';
import produccionRoutes from './routes/produccion.routes';
import planificacionRoutes from './routes/planificacion.routes';
import ventaRoutes from './routes/venta.routes';

import cursoRoutes from './routes/curso.routes';
import rolEmpresaRoutes from './routes/rol-empresa.routes';
import metodoPagoRoutes from './routes/metodo-pago.routes';

import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', healthRoutes);
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/alumnos', alumnoRoutes);
app.use('/empresas', empresaRoutes);
app.use('/docentes', docenteRoutes);
app.use('/productos', productoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/produccion', produccionRoutes);
app.use('/planificacion', planificacionRoutes);
app.use('/ventas', ventaRoutes);

app.use('/cursos', cursoRoutes);
app.use('/roles-empresa', rolEmpresaRoutes);
app.use('/metodos-pago', metodoPagoRoutes);

if (process.env.ENVIRONMENT === 'development') {
  import('./docs/scalar').then(({ default: scalarDocs }) => {
    app.use('/docs', scalarDocs);
  });
}

app.use(errorMiddleware);

export default app;
