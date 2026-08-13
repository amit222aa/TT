// ===================================
// API.JS - API Communication
// ===================================

const API_BASE_URL = 'http://localhost:8000/api';
const TIMEOUT = 500;

class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), TIMEOUT);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: { username, password }
        });
    }

    async register(username, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: { username, email, password }
        });
    }

    // Menu endpoints
    async getMenuItems() {
        return this.request('/menu');
    }

    async getMenuByCategory(category) {
        return this.request(`/menu?category=${category}`);
    }

    // Cart endpoints
    async getCart(userId) {
        return this.request(`/cart?user_id=${userId}`);
    }

    async addToCart(userId, itemId, quantity) {
        return this.request('/cart/add', {
            method: 'POST',
            body: { user_id: userId, menu_item_id: itemId, quantity }
        });
    }

    async removeFromCart(userId, itemId) {
        return this.request('/cart/remove', {
            method: 'POST',
            body: { user_id: userId, menu_item_id: itemId }
        });
    }

    async clearCart(userId) {
        return this.request('/cart/clear', {
            method: 'POST',
            body: { user_id: userId }
        });
    }

    // Order endpoints
    async createOrder(userId, items) {
        return this.request('/orders/create', {
            method: 'POST',
            body: { user_id: userId, items }
        });
    }

    async getOrders(userId) {
        return this.request(`/orders?user_id=${userId}`);
    }

    async getOrderDetails(orderId) {
        return this.request(`/orders/${orderId}`);
    }

    async updateOrderStatus(orderId, status) {
        return this.request(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: { status }
        });
    }
}

// Create global API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Helper functions for common API operations
async function fetchMenuItems() {
    try {
        const data = await apiClient.getMenuItems();
        return data;
    } catch (error) {
        console.error('Failed to fetch menu items:', error);
        return [];
    }
}

async function fetchUserOrders(userId) {
    try {
        const data = await apiClient.getOrders(userId);
        return data;
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return [];
    }
}

async function submitOrder(userId, items) {
    try {
        const data = await apiClient.createOrder(userId, items);
        return data;
    } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
    }
}

async function authenticateUser(username, password) {
    try {
        const data = await apiClient.login(username, password);
        return data;
    } catch (error) {
        console.error('Authentication failed:', error);
        throw error;
    }
}

async function registerUser(username, email, password) {
    try {
        const data = await apiClient.register(username, email, password);
        return data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}
