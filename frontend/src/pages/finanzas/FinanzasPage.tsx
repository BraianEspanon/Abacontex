import { Building2, ChevronRight, CircleHelp, CirclePlus, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import ConciliacionFinanciera from '../../components/finanzas/ConciliacionFinanciera';
import GraficoFinanciero from '../../components/finanzas/GraficoFinanciero';
import MovimientosFinancieros from '../../components/finanzas/MovimientosFinancieros';
import RegistrarMovimientoModal from '../../components/finanzas/RegistrarMovimientoModal';
import ResumenFinanciero from '../../components/finanzas/ResumenFinanciero';
import TabsFinanzas from '../../components/finanzas/TabsFinanzas';
import Button from '../../components/ui/Button';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useEmpresaActual } from '../../hooks/useEmpresaActual';
import { useResumenFinanciero } from '../../hooks/useResumenFinanciero';

import type { TabFinanzas } from '../../components/finanzas/TabsFinanzas';
import type { PeriodoGraficoFinanciero } from '../../types/finanzas.types';

import { esCursoSexto } from '../../utils/curso.utils';

export default function FinanzasPage() {
  const [tabActiva, setTabActiva] = useState<TabFinanzas>('flujo');

  const [periodoGrafico, setPeriodoGrafico] = useState<PeriodoGraficoFinanciero>('6meses');

  const [modalMovimientoAbierto, setModalMovimientoAbierto] = useState(false);

  const { data: alumno, isLoading: cargandoAlumno, isError: errorAlumno } = useAlumnoActual();

  const { data: empresa, isLoading: cargandoEmpresa, isError: errorEmpresa } = useEmpresaActual();

  const {
    data: resumen,
    isLoading: cargandoResumen,
    isError: errorResumen,
  } = useResumenFinanciero(Boolean(empresa));

  const cargandoDatosBase = cargandoAlumno || cargandoEmpresa;
  const errorDatosBase = errorAlumno || errorEmpresa;

  const mostrarConciliacion =
    Boolean(empresa) && !cargandoAlumno && !errorAlumno && esCursoSexto(alumno?.curso?.nombre);

  /*
   * Si por algún motivo la conciliación deja de estar disponible,
   * la interfaz vuelve visualmente al flujo sin necesitar sincronizar
   * estado mediante un useEffect.
   */
  const tabActivaMostrada: TabFinanzas =
    tabActiva === 'conciliacion' && !mostrarConciliacion ? 'flujo' : tabActiva;

  const handleCambiarTab = (nuevaTab: TabFinanzas) => {
    if (nuevaTab === 'conciliacion' && !mostrarConciliacion) {
      return;
    }

    setTabActiva(nuevaTab);
  };

  const handleMovimientoRegistrado = () => {
    setTabActiva('movimientos');
  };

  /*
   * Encabezado base utilizado en estados de error
   * o cuando el alumno todavía no tiene empresa.
   */
  const encabezadoBase = (
    <>
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Gestión financiera</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Gestión financiera</h1>

        <p className="mt-1 text-sm text-gray-500">Controlá los ingresos y egresos de tu empresa.</p>
      </header>
    </>
  );

  if (cargandoDatosBase) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando información financiera...</p>
      </div>
    );
  }

  if (errorDatosBase || !alumno) {
    return (
      <div className="space-y-5">
        {encabezadoBase}

        <div className="flex justify-center pt-6">
          <section className="w-full max-w-2xl rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                <CircleHelp size={24} className="text-red-500" />
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold text-abacontex-black-text">
                  No pudimos cargar tus finanzas
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-abacontex-gray-text">
                  Ocurrió un problema al consultar la información necesaria. Intentá nuevamente en
                  unos minutos.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="space-y-5">
        {encabezadoBase}

        <div className="flex justify-center pt-6">
          <section className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary/10">
              <Building2 size={36} className="text-abacontex-primary" />
            </div>

            <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
              Todavía no podés gestionar tus finanzas
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
              Para registrar y consultar movimientos financieros primero tenés que formar parte de
              una empresa de tu curso.
            </p>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
              Cuando seas incorporado a una empresa, vas a poder gestionar desde acá los ingresos,
              egresos y el flujo financiero de la empresa.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-abacontex-gray-text">
              <Building2 className="h-4 w-4 text-abacontex-primary" />

              <span>Tu acceso se habilitará automáticamente cuando pertenezcas a una empresa.</span>
            </div>
          </section>
        </div>
      </div>
    );
  }

  /*
   * Conciliación posee una estructura visual propia.
   * No mostramos las tarjetas generales de Finanzas
   * porque esta vista tiene sus propios indicadores.
   */
  if (tabActivaMostrada === 'conciliacion' && mostrarConciliacion) {
    return (
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span>Gestión financiera</span>

          <ChevronRight className="h-4 w-4" />

          <span className="font-semibold text-gray-800">Conciliación financiera</span>
        </nav>

        {/* Encabezado específico */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Conciliación financiera</h1>

          <p className="mt-1 text-sm text-gray-500">
            Compará el saldo registrado por el sistema con el efectivo real en caja.
          </p>
        </header>

        <ConciliacionFinanciera
          tabs={
            <TabsFinanzas
              tabActiva={tabActivaMostrada}
              onChange={handleCambiarTab}
              mostrarConciliacion={mostrarConciliacion}
            />
          }
        />
      </div>
    );
  }

  /*
   * Flujo de fondos y Movimientos mantienen
   * el encabezado general de Finanzas.
   */
  return (
    <>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Gestión financiera</span>
        </nav>

        {/* Encabezado */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión financiera</h1>

            <p className="mt-1 text-sm text-gray-500">
              Controlá los ingresos y egresos de tu empresa.
            </p>
          </div>

          <Button
            type="button"
            label="Nuevo movimiento"
            variant="solid"
            icon={<CirclePlus className="h-4 w-4" />}
            onClick={() => setModalMovimientoAbierto(true)}
          />
        </header>

        {/* Resumen general */}
        {errorResumen ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            No se pudo cargar el resumen financiero.
          </div>
        ) : (
          <ResumenFinanciero resumen={resumen} isLoading={cargandoResumen} />
        )}

        {/* Tabs */}
        <TabsFinanzas
          tabActiva={tabActivaMostrada}
          onChange={handleCambiarTab}
          mostrarConciliacion={mostrarConciliacion}
        />

        {/* Contenido */}
        {tabActivaMostrada === 'flujo' && (
          <GraficoFinanciero periodo={periodoGrafico} onPeriodoChange={setPeriodoGrafico} />
        )}

        {tabActivaMostrada === 'movimientos' && <MovimientosFinancieros />}
      </div>

      <RegistrarMovimientoModal
        isOpen={modalMovimientoAbierto}
        onClose={() => setModalMovimientoAbierto(false)}
        onRegistrado={handleMovimientoRegistrado}
      />
    </>
  );
}
