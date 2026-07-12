import {
  Building2,
  GraduationCap,
  NotebookPen,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import TarjetaResumen from '../../components/docente/TarjetaResumen';
import GraficoEvolucion from '../../components/docente/inicio/GraficoEvolucion';
import AlumnosEnRiesgo from '../../components/docente/inicio/AlumnosEnRiesgo';
import RankingEmpresarial from '../../components/docente/inicio/RankingEmpresarial';
import DesempenoPorCurso from '../../components/docente/inicio/DesempenoPorCurso';
import CorreccionesPendientes from '../../components/docente/inicio/CorreccionesPendientes';
import AlertasCurso from '../../components/docente/inicio/AlertasCurso';
import { useUsuarioActual } from '../../hooks/useUsuarioActual';



const tarjetasResumen = [
  {
    titulo: 'Cursos activos',
    valor: 3,
    textoInferior: 'Ver cursos',
    icono: GraduationCap,
  },
  {
    titulo: 'Empresas activas',
    valor: 30,
    textoInferior: 'Ver empresas',
    icono: Building2,
  },
  {
    titulo: 'Alumnos',
    valor: 112,
    textoInferior: 'Ver alumnos',
    icono: UsersRound,
  },
  {
    titulo: 'Ejercicios por corregir',
    valor: 18,
    textoInferior: 'Pendientes de revisión',
    icono: NotebookPen,
    destacado: true,
  },
  {
    titulo: 'Puntaje promedio empresarial',
    valor: '74,6 / 100',
    textoInferior: '+0,2 pts respecto al mes anterior',
    icono: TrendingUp,
  },
];

export default function InicioDocente() {
  const {
  data: usuario,
  isLoading: cargandoUsuario,
  isError: errorUsuario,
  } = useUsuarioActual();

  const nombreDocente = usuario?.nombre ?? 'Docente';
  return (
    <section className="w-full">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#20251f]">
            ¡Hola, <span className="italic text-[#62865b]"> {cargandoUsuario ? '...' : nombreDocente}!</span>
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Bienvenida a tu panel docente.
          </p>
          
           {errorUsuario && (
            <p className="mt-2 text-sm text-red-600">
              No se pudieron cargar los datos del usuario.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-w-44 flex-col gap-1 text-xs font-medium text-[#293129]">
            Año
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#64895e]">
              <option>Año lectivo 2026</option>
              <option>Año lectivo 2025</option>
            </select>
          </label>

          <label className="flex min-w-44 flex-col gap-1 text-xs font-medium text-[#293129]">
            Curso
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#64895e]">
              <option>Todos mis cursos</option>
              <option>5to Año - Div II</option>
              <option>6to Año - Div II</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {tarjetasResumen.map((tarjeta) => (
          <TarjetaResumen
            key={tarjeta.titulo}
            titulo={tarjeta.titulo}
            valor={tarjeta.valor}
            textoInferior={tarjeta.textoInferior}
            icono={tarjeta.icono}
            destacado={tarjeta.destacado}
          />
        ))}
      </div>
      
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <GraficoEvolucion />
          <AlumnosEnRiesgo />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr_0.8fr]">
  <RankingEmpresarial />
  <DesempenoPorCurso />

  <div className="grid gap-5">
    <CorreccionesPendientes />
    <AlertasCurso />
  </div>
</div>
    </section>
  );
}