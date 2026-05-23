import Storage from './storage.js';

class Wishlist {
    constructor() {
        this.items = Storage.get('wishlist') || [];
        this.updateBadge();
    }

    save() {
        Storage.set('wishlist', this.items);
        this.updateBadge();
        window.dispatchEvent(new Event('wishlistUpdated'));
    }

    toggle(product) {
        const index = this.items.findIndex(item => item.id === product.id);
        let isAdded = false;
        if (index > -1) {
            this.items.splice(index, 1);
        } else {
            this.items.push(product);
            isAdded = true;
        }
        this.save();
        return isAdded;
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
    }

    has(productId) {
        return this.items.some(item => item.id === productId);
    }

    updateBadge() {
        const badge = document.getElementById('wishlist-badge');
        if (badge) {
            const count = this.items.length;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
}

const wishlistInstance = new Wishlist();
export default wishlistInstance;
