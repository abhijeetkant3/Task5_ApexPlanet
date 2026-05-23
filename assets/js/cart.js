import Storage from './storage.js';

class Cart {
    constructor() {
        this.items = Storage.get('cart') || [];
        this.updateBadge();
    }

    save() {
        Storage.set('cart', this.items);
        this.updateBadge();
        
        // Dispatch custom event for cart updates to trigger UI refreshes
        window.dispatchEvent(new Event('cartUpdated'));
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ ...product, quantity });
        }
        this.save();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
        }
    }

    clear() {
        this.items = [];
        this.save();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    updateBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.getCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
}

const cartInstance = new Cart();
export default cartInstance;
