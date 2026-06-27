// src/pages/RoleSelection.tsx
import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Briefcase, Settings, Wallet, Cpu, Megaphone, Network, Target, GraduationCap, BookOpen, Library, School, ArrowRightFromLine } from 'lucide-react';
import RoleCard from '../components/ui/RoleCard';
import Button from '../components/ui/Button';
import { useAssignRole } from '../hooks/useAssignRole';

// 1. Lista de Roles Actualizada
const ROLES_DATA = [
  { id: 'ceo', title: 'CEO', icon: Briefcase, description: 'Director Ejecutivo' },
  { id: 'coo', title: 'COO', icon: Settings, description: 'Director de Operaciones' },
  { id: 'cfo', title: 'CFO', icon: Wallet, description: 'Director Financiero' },
  { id: 'cto', title: 'CTO', icon: Cpu, description: 'Director Tecnológico' },
  { id: 'cco', title: 'CCO', icon: Megaphone, description: 'Director de Comunicación' },
  { id: 'cio', title: 'CIO', icon: Network, description: 'Director de Sistemas de Información' },
  { id: 'cmo', title: 'CMO', icon: Target, description: 'Director de Marketing' },
];

// 2. Lista de Cursos
const COURSES_DATA = [
  { id: '5II', title: '5to Año - Div II', icon: BookOpen },
  { id: '5III', title: '5to Año - Div III', icon: Library },
  { id: '6II', title: '6to Año - Div II', icon: School },
  { id: '6III', title: '6to Año - Div III', icon: GraduationCap},
];

export default function RoleSelection() {
  const { keycloak } = useKeycloak();
  const firstName = keycloak.tokenParsed?.given_name || keycloak.tokenParsed?.preferred_username || 'Alumno';

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const { mutate: setupAccount, isPending } = useAssignRole();

  const handleContinue = () => {
    if (!selectedRole || !selectedCourse) return;
    setupAccount({ roleId: selectedRole, courseId: selectedCourse });
  };

  const isFormValid = selectedRole !== null && selectedCourse !== null;

  return (
        <div className="min-h-screen bg-abacontext-light-bg flex flex-col items-center py-10 px-4 sm:px-6 font-sans">
        
            <div className="w-full max-w-4xl bg-white rounded-4xl shadow-xl shadow-abacontex-dark/5 overflow-hidden mb-8">
                
                {/* --- HEADER --- */}
                <div className="relative bg-[#1d2620] px-8 py-10 md:px-12 md:py-14 overflow-hidden text-center">
                
                    <div className="absolute -top-16 -right-12 w-48 h-48 bg-[#2d3a31] rounded-full opacity-80 mix-blend-screen"></div>
                    <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-[#2d3a31] rounded-full opacity-80 mix-blend-screen"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="flex items-center w-full max-w-87.5 mb-8">
                        <div className="w-14 h-14 rounded-full bg-[#6a9071] text-white flex items-center justify-center font-bold text-2xl font-heading shadow-lg">
                            1
                        </div>
                        <div className="flex-1 h-1 bg-[#6a9071] opacity-70"></div>
                        <div className="w-14 h-14 rounded-full bg-[#6a9071] text-white flex items-center justify-center font-bold text-2xl font-heading shadow-lg">
                            2
                        </div>
                        </div>

                        <h1 className="font-heading font-extrabold text-5xl text-white mb-3 tracking-tight">
                        ¡Casi listo, {firstName}!
                        </h1>
                        <p className="text-abacontex-light/80 text-xl max-w-lg font-heading font-light">
                        Elegí tu rol en la empresa y tu curso para completar el registro
                        </p>
                    </div>
                </div>
                
                {/* --- CONTENIDO --- */}
                <div className="p-8 md:p-10">
                
                {/* CURSOS */}
                <div className="mb-10">
                    <h2 className="font-heading font-bold text-xl text-abacontex-black-text mb-5 border-b border-abacontex-gray/20 pb-2">
                    Seleccioná tu curso
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {COURSES_DATA.map((course) => (
                        <RoleCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        icon={course.icon}
                        isSelected={selectedCourse === course.id}
                        onClick={setSelectedCourse}
                        />
                    ))}
                    </div>
                </div>

                {/* ROLES */}
                <div className="mb-8">
                    <h2 className="font-heading font-bold text-xl text-abacontex-black-text mb-5 border-b border-abacontex-gray/20 pb-2">
                    Seleccioná tu departamento
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ROLES_DATA.map((role) => (
                        <RoleCard
                        key={role.id}
                        id={role.id}
                        title={role.title}
                        description={role.description}
                        icon={role.icon}
                        isSelected={selectedRole === role.id}
                        onClick={setSelectedRole}
                        />
                    ))}
                    </div>
                </div>

                {/* BOTÓN */}
                <div className="flex flex-col justify-end pt-6 items-center">
                    <div className={`transition-all duration-300 ${!isFormValid ? 'opacity-50 grayscale cursor-not-allowed' : 'opacity-100'}`}>
                    <Button 
                        label={isPending ? "Guardando..." : "Completar Registro"} 
                        variant={isFormValid ? 'solid' : 'outline'}
                        icon= {<ArrowRightFromLine className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />}
                        onClick={handleContinue}
                        disabled={isPending || !isFormValid} 
                        />
                    </div>
                </div>

                </div>
            </div>
        </div>
    );
}
                  