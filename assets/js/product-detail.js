import API from './api.js';
import cartInstance from './cart.js';
import wishlistInstance from './wishlist.js';
import { showToast } from './main.js';
import { createProductCard } from './products.js';

const initProductDetail = async () => {
    const detailContainer = document.getElementById('product-detail-container');
    if (!detailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        detailContainer.innerHTML = '<p>Product not found.</p>';
        return;
    }

    try {
        detailContainer.innerHTML = '<div class="skeleton" style="height: 400px; width: 100%;"></div>';
        const product = await API.getProduct(productId);

        document.title = `${product.title} | A-Kart`;

        detailContainer.innerHTML = `
            <div class="product-detail-grid">
                <div class="product-gallery" style="background: white; padding: 2rem; border: 1px solid var(--border-color); border-radius: var(--radius-lg); display:flex; justify-content:center; align-items:center;">
                    <img src="${product.image}" alt="${product.title}" style="max-height: 400px; object-fit: contain;">
                </div>
                <div class="product-info-detail">
                    <p class="product-category" style="margin-bottom:1rem;">${product.category}</p>
                    <h1 style="font-size: 2rem; margin-bottom: 1rem;">${product.title}</h1>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                        <span style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">$${product.price.toFixed(2)}</span>
                        <span style="color: var(--warning-color);"><i class="fas fa-star"></i> ${product.rating.rate} (${product.rating.count} reviews)</span>
                    </div>
                    <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem;">${product.description}</p>
                    
                    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 2rem; flex-wrap: wrap;">
                        <div style="display: flex; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden;">
                            <button id="qty-minus" style="padding: 0.5rem 1rem; border: none; background: var(--bg-secondary); cursor: pointer;">-</button>
                            <input type="number" id="qty-input" value="1" min="1" style="width: 50px; text-align: center; border: none; outline: none; background: var(--bg-main); color: var(--text-main);">
                            <button id="qty-plus" style="padding: 0.5rem 1rem; border: none; background: var(--bg-secondary); cursor: pointer;">+</button>
                        </div>
                        <button id="add-to-cart-detail" class="btn btn-primary" style="flex-grow: 1; padding: 0.75rem; min-width: 150px;">Add to Cart</button>
                        <button id="wishlist-detail" class="btn btn-outline" style="padding: 0.75rem;">
                            <i class="${wishlistInstance.has(product.id) ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Logic
        const qtyInput = document.getElementById('qty-input');
        document.getElementById('qty-minus').addEventListener('click', () => {
            if (qtyInput.value > 1) qtyInput.value--;
        });
        document.getElementById('qty-plus').addEventListener('click', () => {
            qtyInput.value++;
        });

        document.getElementById('add-to-cart-detail').addEventListener('click', () => {
            cartInstance.addItem(product, parseInt(qtyInput.value));
            showToast('Added to cart!');
        });

        const wishBtn = document.getElementById('wishlist-detail');
        wishBtn.addEventListener('click', () => {
            const isAdded = wishlistInstance.toggle(product);
            wishBtn.querySelector('i').className = isAdded ? 'fas fa-heart' : 'far fa-heart';
            showToast(isAdded ? 'Added to wishlist!' : 'Removed from wishlist!');
        });

        // Load Related Products
        const relatedGrid = document.getElementById('related-products-grid');
        if (relatedGrid) {
            const categoryProducts = await API.getProductsByCategory(product.category);
            const related = categoryProducts.filter(p => p.id !== product.id).slice(0, 4);
            related.forEach(p => {
                relatedGrid.appendChild(createProductCard(p));
            });
        }

    } catch (error) {
        console.error(error);
        detailContainer.innerHTML = '<p>Error loading product details.</p>';
    }
};

document.addEventListener('DOMContentLoaded', initProductDetail);
