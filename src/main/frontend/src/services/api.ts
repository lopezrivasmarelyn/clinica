// src/services/api.ts

/**
 * CONFIGURACIÓN DE LA URL BASE
 * - Emulador Android Studio: 'http://10.0.2.2:8080/api'
 * - Simulador iOS o Web: 'http://localhost:8080/api'
 * - Dispositivo físico (Expo Go en tu cel): la IP de tu red local (ej. 'http://192.168.1.15:8080/api')
 */
const BASE_URL = 'http://192.168.1.149:8080/api';

// Función auxiliar reutilizable para peticiones HTTP
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error HTTP: ${response.status}`);
    }

    return response.json();
}

// Interfaces de TypeScript para las entidades de la app
export interface Afiliado {
    id: number;
    nombre: string;
    email: string;
    numeroPoliza: string;
    telefono: string;
}

export interface CentroMedico {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    latitud: number;
    longitud: number;
    activo: boolean;
}

export interface Cita {
    id?: number;
    afiliado: { id: number };
    centroMedico: { id: number };
    especialidad: string;
    fechaHora: string;
    estado?: string;
}

// Objeto principal que exporta todas las llamadas a la API de Spring Boot
export const ApiService = {
    // 1. Autenticación
    login: async (numeroPoliza: string, password: string): Promise<Afiliado> => {
        return request<Afiliado>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ numeroPoliza, password }),
        });
    },

    // 2. Centros Médicos
    getCentrosMedicos: async (): Promise<CentroMedico[]> => {
        return request<CentroMedico[]>('/centros-medicos');
    },

    // 3. Citas Médicas
    getCitasPorAfiliado: async (afiliadoId: number): Promise<Cita[]> => {
        return request<Cita[]>(`/citas/afiliado/${afiliadoId}`);
    },

    agendarCita: async (cita: Cita): Promise<Cita> => {
        return request<Cita>('/citas', {
            method: 'POST',
            body: JSON.stringify(cita),
        });
    },

    cancelarCita: async (citaId: number): Promise<Cita> => {
        return request<Cita>(`/citas/${citaId}/cancelar`, {
            method: 'PUT',
        });
    },
};