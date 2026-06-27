import Button from "../components/ui/Button";
import FeatureCard from "../components/ui/FeatureCard";
import BokehContainer from "../components/ui/BokehContainer";
import TimelineStep from "../components/ui/TimelineStep";
import { Package, ShoppingCart, Factory, Truck, Receipt, ArrowRight, Astroid, RefreshCw, ChartColumnBigIcon, ZapIcon, BookOpen, CircleDollarSign } from 'lucide-react';
import Navbar from "../layouts/Navbar";

export default function LandingPage() {

    return (
        /* Contenedor principal */
        <div className="relative min-h-screen bg-abacontex-light overflow-hidden">

            {/* --- FONDO HERO (PATRÓN DE CUADRADOS) --- */}
            <div className="absolute top-0 left-0 w-full h-[80vh] pointer-events-none z-0">
                <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="cuadricula" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-abacontex-dark opacity-[0.1]" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cuadricula)" />
                </svg>
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-abacontex-light/50 to-abacontex-light"></div>
            </div>   

            <Navbar /> 

            {/* --- SECCIÓN HERO --- */}
            <main className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 px-8 pt-32 pb-20 max-w-7xl mx-auto items-center">
                <div className="flex flex-col gap-6 items-center">
                    <h1 className="font-heading text-6xl lg:text-7xl font-extrabold text-abacontex-black-text leading-tight">
                        Convertí el aula en una <span className="text-abacontex-primary-two">empresa</span>
                    </h1>
                    <p className="text-lg text-abacontex-gray-text max-w-lg leading-relaxed text-center">
                        Una plataforma donde los estudiantes aprenden gestionando proyectos, tomando decisiones y trabajando en equipo en un entorno colaborativo.
                    </p>
                    <Button label="Crear una cuenta gratuita" variant="solid"/>
                </div>

                <div className="relative w-full flex items-center justify-center">
                    <img 
                        src="/img/hero-image.png" 
                        alt="Flujo de simulación de ABACONTEX" 
                        className="w-full h-auto max-h-162.5 scale-125 object-contain drop-shadow-2xl"
                    />
                </div>
            </main>

           {/* --- SECCIÓN CARACTERÍSTICAS --- */}
            <section id="caracteristicas" className="relative z-10 px-8 py-24 max-w-7xl mx-auto">
                <div className="text-center mb-16 flex flex-col items-center gap-4">
                    <Button label="CARACTERÍSTICAS" variant="pill" />
                    <h2 className="font-heading text-5xl lg:text-6xl font-semibold text-abacontex-black-text leading-tight">
                        Todo lo que <span className="text-abacontex-primary-two">necesitas</span> en un sólo lugar
                    </h2>
                    <p className="text-lg text-abacontex-gray-text max-w-lg leading-relaxed">
                        Herramientas diseñadas para transformar la teoría en una experiencia práctica de aprendizaje
                    </p>
                </div>

                {/* Grilla con las tarjetas explicando las funciones de la App */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Astroid className="w-6 h-6" />}
                        title="Ejercicios contables con IA"
                        description="El docente genera enunciados automáticamente. La IA corrige y da feedback personalizado."
                    />

                    <FeatureCard
                        icon={<RefreshCw className="w-6 h-6" />}
                        title="Flujo empresarial"
                        description="Los alumnos simulan una empresa real con stock, pedidos, ventas, producción y contabilidad."
                    />

                    <FeatureCard
                        icon={<ChartColumnBigIcon className="w-6 h-6" />}
                        title="Analítica docente"
                        description="Seguí el progreso de cada alumno, detectá riesgos y tomá decisiones pedagógicas con datos."
                    />

                    <FeatureCard 
                        icon={<ZapIcon className="w-6 h-6"/>}
                        title="Gamificación"
                        description="Sistema de niveles, XP, y logros que motiva a los estudiantes a seguir aprendiendo."
                    />

                    <FeatureCard 
                        icon={<BookOpen className="w-6 h-6"/>}
                        title="Manual de cuentas"
                        description="Wiki contable integrada con más de 50 cuentas clasificadas por tipo, naturaleza y ejemplos."
                    />

                    <FeatureCard 
                        icon={<CircleDollarSign className="w-6 h-6"/>}
                        title="Gestión financiera"
                        description="Manejá el flujo de caja, calculá costos y maximizá rentabilidad como lo haría un CFO real."
                    />
                </div>
            </section>

            {/* --- SECCIÓN CARACTERÍSTICAS --- */}
            <section id="simulacion" className="bg-abacontex-dark text-white">
                
                <BokehContainer className="py-28">
                    <div className="max-w-7xl mx-auto px-8">
                        
                        <div className="text-center mb-16 flex flex-col items-center gap-4">
                            <Button label="SIMULACIÓN" variant="pill" />

                            <h2 className="font-heading text-5xl lg:text-6xl font-semibold text-abacontext-light-bg leading-tight">
                                Así se vive la <span className="text-abacontex-primary-two">experiencia</span>
                            </h2>
                            <p className="text-lg text-abacontext-light-bg max-w-lg leading-relaxed">
                                Cada alumno gestiona su empresa paso a paso, tomando decisiones reales con consecuencias contables.
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-12 lg:gap-0">
                        
                            <TimelineStep 
                                number={1}
                                title="Inventario y Productos"
                                icon={<Package className="w-7 h-7" />}
                            />
                            
                            <TimelineStep 
                                number={2}
                                title="Recepción de Pedidos"
                                icon={<ShoppingCart className="w-7 h-7" />}
                            />

                            <TimelineStep 
                                number={3}
                                title="Decisión de Producción"
                                icon={<Factory className="w-7 h-7" />}
                            />

                            <TimelineStep 
                                number={4}
                                title="Logística y Entregas"
                                icon={<Truck className="w-7 h-7" />}
                            />

                            <TimelineStep 
                                number={5}
                                title="Ventas y Facturación"
                                icon={<Receipt className="w-7 h-7" />}
                                isLast={true}
                            />

                        </div>
                    </div>
                </BokehContainer>
            </section>

            {/* --- SECCIÓN DOCENTES --- */}
            <section id="docentes" className="bg-abacontex-light py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center text-center">
                        <div className="lg:w-1/3 lg:sticky lg:top-32">
                            <Button variant="pill" label="PARA DOCENTES" />
                            <h2 className="font-heading text-5xl lg:text-6xl font-semibold text-abacontex-black-text leading-tight mt-6 mb-5">
                            El docente como <span className="text-abacontex-primary-two">director del juego</span> 
                            </h2>
                            <p className="text-lg text-abacontex-gray-text max-w-lg leading-relaxed">
                                Los docentes tienen acceso a un panel de control completo para gestionar la experiencia de aprendizaje de toda la clase
                            </p>
                        </div>

                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FeatureCard
                                title="Supervisá equipos"
                                description="Monitoreá el progreso de cada grupo en tiempo real con reportes detallados por período"
                            />

                            <FeatureCard 
                                title="Configurá simulaciones"
                                description="Definí parámetros de mercado, dificultad, cantidad de períodos y condiciones iniciales"
                            />

                            <FeatureCard 
                                title="Analizá resultados"
                                description="Accedé a informes comparativos entre equipos, exportables para el libro de calificaciones"
                            />

                            <FeatureCard 
                                title="Evaluá el desempeño"
                                description="Rúbricas automáticas basadas en indicadores financieros y decisiones estratégicas"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN DE CIERRE  --- */}
            <section className="bg-abacontex-light pb-24 px-8">
                
                <div className="max-w-7xl mx-auto bg-abacontex-dark rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-abacontex-primary-two/20">
            
                    <div className="absolute top-[-10%] left-[-5%] w-32 h-32 bg-abacontex-primary-three/10 rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-44 h-44 bg-abacontex-primary-three/10 rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8">
                        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white leading-tight">
                        ¿Listo para dirigir tu <span className="text-abacontex-primary-three">empresa</span>?
                        </h2>
                        
                        <p className="text-abacontex-light/80 text-lg font-sans leading-relaxed max-w-2xl">
                            Accedé a tu espacio de simulación empresarial. Registrate en Abacontex y empezá hoy.
                        </p>

                        <div className="font-sans mt-2">
                            <Button label="Crear mi cuenta" variant="solid" icon={<ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />}/>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-abacontex-light border-t border-abacontex-gray/60 pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-8">
                
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
                        
                        {/* Columna Marca */}
                        <div className="text-3xl font-extrabold text-abacontex-dark tracking-tight font-heading">
                            ABACONTEX
                        </div>

                        {/* Columna Navegación */}
                        <div className="md:col-span-3 md:col-start-7 flex flex-col gap-4 font-sans">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-abacontex-black-text">
                                Plataforma
                            </h4>
                            <ul className="flex flex-col gap-3 text-sm text-abacontex-gray-text">
                                <li><a href="#caracteristicas" className="hover:text-abacontex-primary transition-colors">Características</a></li>
                                <li><a href="#simulacion" className="hover:text-abacontex-primary transition-colors">Simulación Alumnos</a></li>
                                <li><a href="#docentes" className="hover:text-abacontex-primary transition-colors">Panel Docente</a></li>
                            </ul>
                        </div>

                        {/* Columna Institucional */}
                        <div className="md:col-span-3 flex flex-col gap-4 font-sans">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-abacontex-black-text">
                                Soporte
                            </h4>
                            <ul className="flex flex-col gap-3 text-sm text-abacontex-gray-text">
                                <li><a href="#" className="hover:text-abacontex-primary transition-colors">Contacto Técnico</a></li>
                                <li><a href="#" className="hover:text-abacontex-primary transition-colors">Términos de Servicio</a></li>
                                <li><a href="#" className="hover:text-abacontex-primary transition-colors">Política de Privacidad</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Barra Inferior del Copyright */}
                    <div className="border-t border-abacontex-gray/40 pt-8 items-center font-sans text-xs text-abacontex-gray-text text-center">
                        <div>
                            &copy; {new Date().getFullYear()} ABACONTEX. Todos los derechos reservados.
                        </div>
                    </div>
                </div>
            </footer>
                
        </div>
    )
}