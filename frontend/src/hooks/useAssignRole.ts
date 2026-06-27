import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { setupUserAccount } from "../api/auth.api";

interface SetupPayload {
  roleId: string;
  courseId: string;
}

export const useAssignRole = () => {
    const navigate = useNavigate();

  return useMutation({
    // Le pasamos el paquete completo
    mutationFn: (data: SetupPayload) => setupUserAccount(data),
    
    onSuccess: () => {
      console.log('¡Configuración de cuenta exitosa!');
      
      navigate('/dashboard')
    },
    
    onError: (error) => {
      console.error('Error al guardar la configuración:', error);
    },
  });
};