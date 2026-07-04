// src/api/auth.api.ts
import axios from 'axios';

// La URL del backend
const API_URL = import.meta.env.VITE_API_URL;

interface SetupPayload {
  roleId: string;
  courseId: string;
}

export const setupUserAccount = async (data: SetupPayload) => {
  // Mandamos ambos datos al backend en una sola petición
  const response = await axios.post(`${API_URL}/users/setup`, {
    role: data.roleId,
    course: data.courseId,
  });
  return response.data;
};
