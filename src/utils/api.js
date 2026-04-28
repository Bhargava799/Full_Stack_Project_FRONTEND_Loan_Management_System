const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const handleResponse = async (response) => {
    // If empty response (e.g. 204 No Content)
    if (response.status === 204) return null;

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        throw new Error('Session expired. Please login again.');
    }
    
    let data = {};
    try {
        data = await response.json();
    } catch (e) {
        // Handle non-JSON responses or empty bodies
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return null;
    }

    if (!response.ok) {
        // Backend returns ErrorResponse with 'message'
        throw new Error(data.message || 'An unexpected error occurred');
    }
    return data;
};

export const api = {
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: getHeaders()
        });
        return handleResponse(response);
    },
    
    post: async (endpoint, body) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });
        return handleResponse(response);
    },
    
    put: async (endpoint, body) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: body ? JSON.stringify(body) : null
        });
        return handleResponse(response);
    },
    
    delete: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    }
};
