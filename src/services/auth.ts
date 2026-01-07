import { api, ENDPOINTS } from '@/lib/api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: string;
    is_superuser?: boolean;
    organization_id: string;
}

interface AuthResponse {
    access_token: string;
    token_type: string;
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const formData = new URLSearchParams();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);

        const response = await api.post(ENDPOINTS.AUTH.LOGIN, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return response.data;
    },

    register: async (data: any): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get(ENDPOINTS.AUTH.ME);
        return response.data;
    }
};
