import cartInstance from './cart.js';
import { showToast } from './main.js';

const initCartPage = () => {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    const summaryContainer = document.getElementById('cart-summary-container');
    
    if (!container) return;

    const render = () => {
        container.innerHTML = '';
        if (cartInstance.items.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 3rem;"><p>Your cart is empty.</p><a href="products.html" class="btn btn-primary mt-1">Shop Now</a></div>';
            if (summaryContainer) summaryContainer.style.display = 'none';
            return;
        }

        if (summaryContainer) summaryContainer.style.display = 'block';

        cartInstance.items.forEach(item => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '1rem';
            row.style.padding = '1rem';
            row.style.borderBottom = '1px solid var(--border-color)';
            
            row.innerHTML = `
                <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: contain; background: white; padding: 0.5rem; border-radius: var(--radius-sm);">
                <div style="flex-grow: 1;">
                    <a href="product.html?id=${item.id}" style="font-weight: 500;">${item.title}</a>
                    <div style="color: var(--primary-color); font-weight: bold; margin-top: 0.5rem;">$${item.price.toFixed(2)}</div>
                </div>
                <div style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden;">
                    <button class="qty-btn minus" data-id="${item.id}" style="padding: 0.5rem; border: none; background: var(--bg-secondary); cursor: pointer;">-</button>
                    <span style="padding: 0 1rem;">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}" style="padding: 0.5rem; border: none; background: var(--bg-secondary); cursor: pointer;">+</button>
                </div>
                <div style="font-weight: bold; width: 80px; text-align: right;">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-btn" data-id="${item.id}" style="background: none; border: none; color: var(--danger-color); cursor: pointer; padding: 0.5rem;"><i class="fas fa-trash"></i></button>
            `;
            container.appendChild(row);
        });

        if (totalEl) totalEl.textContent = `$${cartInstance.getTotal().toFixed(2)}`;
    };

    container.addEventListener('click', (e) => {
        const minusBtn = e.target.closest('.minus');
        const plusBtn = e.target.closest('.plus');
        const removeBtn = e.target.closest('.remove-btn');

        if (minusBtn) {
            const id = parseInt(minusBtn.dataset.id);
            const item = cartInstance.items.find(i => i.id === id);
            if (item && item.quantity > 1) {
                cartInstance.updateQuantity(id, item.quantity - 1);
                render();
            }
        }
        if (plusBtn) {
            const id = parseInt(plusBtn.dataset.id);
            const item = cartInstance.items.find(i => i.id === id);
            if (item) {
                cartInstance.updateQuantity(id, item.quantity + 1);
                render();
            }
        }
        if (removeBtn) {
            const id = parseInt(removeBtn.dataset.id);
            cartInstance.removeItem(id);
            showToast('Item removed from cart');
            render();
        }
    });

    window.addEventListener('cartUpdated', render);
    render();
};

document.addEventListener('DOMContentLoaded', initCartPage);
