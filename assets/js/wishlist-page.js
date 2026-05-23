import wishlistInstance from './wishlist.js';
import cartInstance from './cart.js';
import { showToast } from './main.js';

const initWishlistPage = () => {
    const container = document.getElementById('wishlist-grid');
    if (!container) return;

    const render = () => {
        container.innerHTML = '';
        if (wishlistInstance.items.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 3rem;"><p>Your wishlist is empty.</p><a href="products.html" class="btn btn-primary mt-1">Shop Now</a></div>';
            return;
        }

        wishlistInstance.items.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <a href="product.html?id=${product.id}">
                        <img loading="lazy" src="${product.image}" alt="${product.title}">
                    </a>
                    <button class="remove-wishlist-btn" data-id="${product.id}" style="position: absolute; top: 10px; right: 10px; background: white; border: 1px solid var(--border-color); border-radius: 50%; width: 30px; height: 30px; cursor: pointer; color: var(--danger-color); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <a href="product.html?id=${product.id}">
                        <h3 class="product-title">${product.title}</h3>
                    </a>
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn btn-primary add-to-cart mt-1" data-id="${product.id}" style="width: 100%;">Move to Cart</button>
                </div>
            `;
            container.appendChild(card);
        });
    };

    container.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-wishlist-btn');
        const cartBtn = e.target.closest('.add-to-cart');

        if (removeBtn) {
            const id = parseInt(removeBtn.dataset.id);
            wishlistInstance.remove(id);
            showToast('Removed from wishlist');
            render();
        }

        if (cartBtn) {
            const id = parseInt(cartBtn.dataset.id);
            const product = wishlistInstance.items.find(i => i.id === id);
            if (product) {
                cartInstance.addItem(product);
                wishlistInstance.remove(id);
                showToast('Moved to cart!');
                render();
            }
        }
    });

    window.addEventListener('wishlistUpdated', render);
    render();
};

document.addEventListener('DOMContentLoaded', initWishlistPage);
