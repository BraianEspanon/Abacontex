import { useState, useEffect } from 'react';

// Le pasamos un "umbral" por defecto de 20px
export function useScroll(umbral: number = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Si la pantalla bajó más que el umbral, devuelve true
      if (window.scrollY > umbral) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [umbral]);

  return scrolled; // El hook solo nos devuelve un "verdadero" o "falso"
}
