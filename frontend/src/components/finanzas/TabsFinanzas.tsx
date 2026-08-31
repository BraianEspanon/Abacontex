export type TabFinanzas = 'flujo' | 'movimientos' | 'conciliacion';

interface Props {
  tabActiva: TabFinanzas;
  onChange: (tab: TabFinanzas) => void;
  mostrarConciliacion: boolean;
}

const tabs: Array<{
  id: TabFinanzas;
  label: string;
  soloSexto?: boolean;
}> = [
  {
    id: 'flujo',
    label: 'Flujo de fondos',
  },
  {
    id: 'movimientos',
    label: 'Movimientos',
  },
  {
    id: 'conciliacion',
    label: 'Conciliación financiera',
    soloSexto: true,
  },
];

export default function TabsFinanzas({ tabActiva, onChange, mostrarConciliacion }: Props) {
  const tabsVisibles = tabs.filter((tab) => !tab.soloSexto || mostrarConciliacion);

  return (
    <div className="inline-flex overflow-hidden rounded-xl border border-gray-300 bg-gray-50 p-1">
      {tabsVisibles.map((tab) => {
        const seleccionada = tabActiva === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
              seleccionada
                ? 'bg-abacontex-primary text-white shadow-sm'
                : 'text-gray-500 hover:bg-white hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
