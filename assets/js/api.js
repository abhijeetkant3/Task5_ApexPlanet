import Storage from './storage.js';
import { CONFIG } from './config.js';

const BASE_URL = CONFIG.FAKESTORE_API_URL;
const CACHE_TIME = 1000 * 60 * 60; // 1 hour caching

const API = {
    async fetchWithCache(url, cacheKey) {
        const cached = Storage.get(cacheKey);
        const now = new Date().getTime(); 

        if (cached && cached.timestamp && (now - cached.timestamp < CACHE_TIME)) {
            return cached.data;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            Storage.set(cacheKey, { data, timestamp: now });
            return data;
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            // Fallback to cache if available even if expired, when network fails
            if (cached) return cached.data;
            throw error;
        }
    },

    async getProducts() {
        return this.fetchWithCache(`${BASE_URL}/products`, 'cached_products');
    },

    async getProduct(id) {
        // Individual product might not be cached, or we can find it in cached_products
        const allProducts = Storage.get('cached_products');
        if (allProducts && allProducts.data) {
            const product = allProducts.data.find(p => p.id === parseInt(id));
            if (product) return product;
        }
        return this.fetchWithCache(`${BASE_URL}/products/${id}`, `cached_product_${id}`);
    },

    async getCategories() {
        return this.fetchWithCache(`${BASE_URL}/products/categories`, 'cached_categories');
    },

    async getProductsByCategory(category) {
        return this.fetchWithCache(`${BASE_URL}/products/category/${category}`, `cached_category_${category}`);
    }
};

export default API;
