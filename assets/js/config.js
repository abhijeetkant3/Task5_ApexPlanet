/**
 * Application Configuration
 * 
 * In a professional development workflow:
 * 1. Values are stored in .env (which is NOT committed).
 * 2. A build tool (like Vite or Webpack) or a backend server 
 *    injects these values into the frontend.
 * 
 * For local development without a bundler, you can temporarily 
 * populate window.ENV in a script tag (and ignore that file in git).
 */
const env = window.ENV || {};

export const CONFIG = {
    PHONEPE_MERCHANT_ID: env.PHONEPE_MERCHANT_ID || '',
    PHONEPE_SALT_KEY: env.PHONEPE_SALT_KEY || '',
    PHONEPE_SALT_INDEX: env.PHONEPE_SALT_INDEX || '1',
    // Defaulting to sandbox URL if not provided in environment
    PHONEPE_URL: env.PHONEPE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
    FAKESTORE_API_URL: env.FAKESTORE_API_URL || 'https://fakestoreapi.com'
};
