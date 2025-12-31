import axiosInstance from './axios';

export const authAPI = {
    register: (userData: any) => axiosInstance.post('/api/auth/register', userData),
    login: (credentials: any) => axiosInstance.post('/api/auth/login', credentials),
    getUser: () => axiosInstance.get('/api/auth/user'),
    updateProfile: (data: any) => axiosInstance.put('/api/auth/profile', data),
};

export const parkingAPI = {
    getAll: (district?: string, neighborhood?: string) => {
        let url = '/api/parking';
        const params = new URLSearchParams();
        if (district) params.append('district', district);
        if (neighborhood) params.append('neighborhood', neighborhood);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        return axiosInstance.get(url);
    },
    updateOccupancy: (id: string, change: number) => axiosInstance.patch(`/api/parking/${id}/occupancy`, { change }),
};

export const reservationAPI = {
    create: (reservationData: any) => axiosInstance.post('/api/reservations', reservationData),
    getMyReservations: () => axiosInstance.get('/api/reservations'),
    cancel: (id: string) => axiosInstance.put(`/api/reservations/${id}/cancel`),
};
