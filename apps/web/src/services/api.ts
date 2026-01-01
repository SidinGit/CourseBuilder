import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

// Add interceptor to attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// Auth API functions
export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login',{email, password})
        return response.data
    },

    register: async (email: string, password: string, name?: string) => {
        const response = await api.post('/auth/register',{email, password, name})
        return response.data
    },
}

export default api