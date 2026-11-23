import type { LucideIcon } from 'lucide-react';

//Se definen las 3 variable que puede tener un botón
export type ButtonVariant = 'solid' | 'outline' | 'pill';

//Se arma la interfaz para el componente
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

//Se arma la interfaz de las cards pertenecientes a características
export interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

//Se arma la interfaz para los círculos difuminados
export interface BokehContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface TimelineStepProps {
  number: number;
  title: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

export interface RoleCardProps {
  id: number;
  title: string;
  description?: string;
  icon: LucideIcon;
  isSelected: boolean;
  onClick: (id: number) => void;
}

export interface LogoAbacontexProps {
  colapsado?: boolean;
}

export interface BarraLateralProps {
  colapsado: boolean;
}

export interface EncabezadoPanelProps {
  sidebarColapsado: boolean;
  onAlternarSidebar: () => void;
}

export interface EncabezadoAlumnoProps extends EncabezadoPanelProps {
  titulo: string;
}
