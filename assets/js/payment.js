import { CONFIG } from './config.js';

const MERCHANT_ID = CONFIG.PHONEPE_MERCHANT_ID;
const SALT_KEY = CONFIG.PHONEPE_SALT_KEY;
const SALT_INDEX = CONFIG.PHONEPE_SALT_INDEX;
const PHONEPE_URL = CONFIG.PHONEPE_URL;

/**
 * Generates SHA256 hash of a string
 * @param {string} message 
 * @returns {Promise<string>}
 */
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Initiates PhonePe payment
 * @param {number} amount Amount in main currency (e.g., dollars/INR)
 * @param {string} mobileNumber 
 * @returns {Promise<void>}
 */
export async function initiatePayment(amount, mobileNumber) {
    const merchantTransactionId = 'MT' + Date.now();
    const payload = {
        merchantId: MERCHANT_ID,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: 'MUID' + Math.floor(Math.random() * 1000000),
        amount: Math.round(amount * 100), // Convert to paise/cents
        redirectUrl: window.location.origin + window.location.pathname.replace('checkout.html', 'index.html'),
        redirectMode: 'REDIRECT',
        callbackUrl: window.location.origin + '/callback', // In a real app, this would be a backend endpoint
        mobileNumber: mobileNumber,
        paymentInstrument: {
            type: 'PAY_PAGE'
        }
    };

    const base64Payload = btoa(JSON.stringify(payload));
    const stringToHash = base64Payload + '/pg/v1/pay' + SALT_KEY;
    const sha256Hash = await sha256(stringToHash);
    const checksum = sha256Hash + '###' + SALT_INDEX;

    console.log('Initiating payment with payload:', payload);

    try {
        const response = await fetch(PHONEPE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            body: JSON.stringify({ request: base64Payload })
        });

        const data = await response.json();
        
        if (data.success && data.data && data.data.instrumentResponse && data.data.instrumentResponse.redirectInfo) {
            console.log('Redirecting to PhonePe:', data.data.instrumentResponse.redirectInfo.url);
            window.location.href = data.data.instrumentResponse.redirectInfo.url;
        } else {
            console.error('PhonePe Response Error:', data);
            throw new Error(data.message || 'Payment initiation failed. Please try again.');
        }
    } catch (error) {
        console.error('Payment Fetch Error:', error);
        throw error;
    }
}
