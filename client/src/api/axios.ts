import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your machine's IP if testing on physical device
// For iOS Simulator, localhost is usually fine.
// For Android Emulator, use 10.0.2.2
const BASE_URL = 'http://localhost:5001';

const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
