import { Bot, Eye, Sparkles } from 'lucide-react';
import abaImg from '../../assets/aba.png';
import clienteImg from '../../assets/cliente.png';
import type {
  IntegranteSimulacion,
  MensajeConversacionSimulacion,
} from '../../types/simulacion.types';

interface HistorialConversacionSimulacionProps {
  titulo: string;
  integrantes: IntegranteSimulacion[];
  mensajes: MensajeConversacionSimulacion[];
  modoLectura?: boolean;
  children?: React.ReactNode;
}

export default function HistorialConversacionSimulacion({
  titulo,
  integrantes,
  mensajes,
  modoLectura = false,
  children,
}: HistorialConversacionSimulacionProps) {
  return (
    <section className="flex min-h-180 flex-col rounded-2xl bg-white shadow-md">
      {/* Cabecera */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <div>
          <h1 className="text-xl font-semibold text-abacontex-black-text">{titulo}</h1>

          {modoLectura && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-abacontex-gray-text">
              <Eye size={13} />
              Modo lectura
            </div>
          )}
        </div>

        <div className="flex -space-x-2">
          {integrantes.slice(0, 4).map((integrante) => (
            <AvatarIntegrante key={integrante.idAlumno} integrante={integrante} />
          ))}

          {integrantes.length > 4 && (
            <div className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-semibold text-gray-600">
              +{integrantes.length - 4}
            </div>
          )}
        </div>
      </header>

      {/* Historial */}
      <div className="flex-1 space-y-5 overflow-y-auto p-6">
        {mensajes.map((mensaje) =>
          mensaje.tipoMensaje === 'DECISION_TOMADA' ? (
            <DecisionTomada key={mensaje.id} mensaje={mensaje} />
          ) : (
            <MensajeSistema key={mensaje.id} mensaje={mensaje} />
          )
        )}

        {mensajes.length === 0 && (
          <div className="flex min-h-64 items-center justify-center">
            <p className="text-sm text-abacontex-gray-text">
              Todavía no hay acontecimientos registrados.
            </p>
          </div>
        )}
      </div>

      {children}
    </section>
  );
}

interface MensajeProps {
  mensaje: MensajeConversacionSimulacion;
}

function MensajeSistema({ mensaje }: MensajeProps) {
  const esSorpresa = mensaje.esSorpresa === true;

  const emisorNormalizado = mensaje.emisor.toUpperCase();

  const imagenEmisor =
    emisorNormalizado === 'ABA' ? abaImg : emisorNormalizado === 'CLIENTE' ? clienteImg : null;

  return (
    <div className="flex max-w-[70%] items-start gap-3">
      <div
        className={[
          'flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full',
          esSorpresa ? 'bg-orange-100' : 'bg-abacontex-primary-three/10',
        ].join(' ')}
      >
        {imagenEmisor ? (
          <img
            src={imagenEmisor}
            alt={formatearEmisor(mensaje.emisor)}
            className="h-full w-full object-contain p-0.5"
          />
        ) : esSorpresa ? (
          <Sparkles size={19} className="text-orange-600" />
        ) : (
          <Bot size={19} className="text-abacontex-primary" />
        )}
      </div>

      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <p className="text-sm font-semibold">{formatearEmisor(mensaje.emisor)}</p>

          <span className="text-[10px] text-abacontex-gray-text">
            {formatearHora(mensaje.fecha)}
          </span>

          {esSorpresa && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-600">
              Evento sorpresa
            </span>
          )}
        </div>

        <div className="rounded-xl rounded-tl-sm bg-abacontex-light px-4 py-3">
          {mensaje.tipoMensaje === 'SITUACION_INICIAL' && (
            <p className="mb-1 text-xs font-semibold text-abacontex-primary">Situación inicial</p>
          )}

          <p className="whitespace-pre-line text-sm leading-5 text-abacontex-black-text">
            {mensaje.mensaje}
          </p>

          {mensaje.rolesHabilitados && mensaje.rolesHabilitados.length > 0 && (
            <p className="mt-2 text-[11px] text-abacontex-gray-text">
              Roles habilitados: {mensaje.rolesHabilitados.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DecisionTomada({ mensaje }: MensajeProps) {
  const decision = mensaje.decision;

  if (!decision) {
    return null;
  }

  const alumno = decision.alumno;

  return (
    <div className="ml-auto flex max-w-[65%] flex-row-reverse items-start gap-3">
      {alumno.fotoPerfilUrl ? (
        <img
          src={alumno.fotoPerfilUrl}
          alt={`${alumno.nombre} ${alumno.apellido}`}
          className="size-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-abacontex-secondary-two/20 text-xs font-semibold text-abacontex-secondary">
          {`${alumno.nombre.charAt(0)}${alumno.apellido.charAt(0)}`.toUpperCase()}
        </div>
      )}

      <div className="min-w-0 text-right">
        <div className="mb-1 flex items-center justify-end gap-2">
          <span className="text-[10px] text-abacontex-gray-text">
            {formatearHora(decision.fechaDecision)}
          </span>

          <p className="text-sm font-semibold">{alumno.nombre}</p>

          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
            {alumno.rol}
          </span>
        </div>

        <div className="rounded-xl rounded-tr-sm bg-abacontex-primary-three px-4 py-3 text-left text-white">
          <p className="text-sm leading-5">{decision.opcionElegida.texto}</p>
        </div>
      </div>
    </div>
  );
}

interface AvatarIntegranteProps {
  integrante: IntegranteSimulacion;
}

function AvatarIntegrante({ integrante }: AvatarIntegranteProps) {
  if (integrante.fotoPerfilUrl) {
    return (
      <img
        src={integrante.fotoPerfilUrl}
        alt={`${integrante.nombre} ${integrante.apellido}`}
        title={`${integrante.nombre} ${integrante.apellido} - ${integrante.rol}`}
        className="size-9 rounded-full border-2 border-white object-cover"
      />
    );
  }

  return (
    <div
      title={`${integrante.nombre} ${integrante.apellido} - ${integrante.rol}`}
      className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-abacontex-primary-three text-[10px] font-semibold text-white"
    >
      {`${integrante.nombre.charAt(0)}${integrante.apellido.charAt(0)}`.toUpperCase()}
    </div>
  );
}

function formatearHora(fecha: string) {
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
}

function formatearEmisor(emisor: string) {
  if (emisor.toUpperCase() === 'ABA') {
    return 'Aba';
  }

  return emisor.toLowerCase().replace(/(^|\s)\S/g, (letra) => letra.toUpperCase());
}
