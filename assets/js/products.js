import API from './api.js';
import cartInstance from './cart.js';
import wishlistInstance from './wishlist.js';
import { showToast } from './main.js';

export const createProductCard = (product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <a href="product.html?id=${product.id}">
                <img loading="lazy" src="${product.image}" alt="${product.title}">
            </a>
            <div class="product-actions">
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                <button class="btn btn-outline toggle-wishlist" data-id="${product.id}">
                    <i class="${wishlistInstance.has(product.id) ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <a href="product.html?id=${product.id}">
                <h3 class="product-title">${product.title}</h3>
            </a>
            <span class="product-price">$${product.price.toFixed(2)}</span>
        </div>
    `;

    // Event Listeners
    const cartBtn = card.querySelector('.add-to-cart');
    cartBtn.addEventListener('click', () => {
        cartInstance.addItem(product);
        showToast('Product added to cart!');
    });

    const wishBtn = card.querySelector('.toggle-wishlist');
    wishBtn.addEventListener('click', () => {
        const isAdded = wishlistInstance.toggle(product);
        const icon = wishBtn.querySelector('i');
        icon.className = isAdded ? 'fas fa-heart' : 'far fa-heart';
        showToast(isAdded ? 'Added to wishlist!' : 'Removed from wishlist!');
    });

    return card;
};

export const renderSkeletons = (container, count = 8) => {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'product-card skeleton';
        skeleton.style.height = '350px';
        container.appendChild(skeleton);
    }
};

// Logic for Products Page
const initProductsPage = async () => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    renderSkeletons(grid, 12);

    try {
        let products = await API.getProducts();
        let filteredProducts = [...products];

        const render = () => {
            grid.innerHTML = '';
            if (filteredProducts.length === 0) {
                grid.innerHTML = '<p class="text-center">No products found.</p>';
                return;
            }
            filteredProducts.forEach(product => {
                grid.appendChild(createProductCard(product));
            });
        };

        // Filter Elements
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        const priceFilter = document.getElementById('price-filter');

        // Populate Categories
        if (categoryFilter) {
            const categories = await API.getCategories();
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                categoryFilter.appendChild(option);
            });
        }

        const applyFilters = () => {
            let result = [...products];
            
            // Category
            if (categoryFilter && categoryFilter.value) {
                result = result.filter(p => p.category === categoryFilter.value);
            }

            // Price
            if (priceFilter && priceFilter.value) {
                const maxPrice = parseFloat(priceFilter.value);
                result = result.filter(p => p.price <= maxPrice);
                document.getElementById('price-value').textContent = `$${maxPrice}`;
            }

            // Sort
            if (sortFilter && sortFilter.value) {
                if (sortFilter.value === 'price-asc') result.sort((a, b) => a.price - b.price);
                if (sortFilter.value === 'price-desc') result.sort((a, b) => b.price - a.price);
                if (sortFilter.value === 'rating') result.sort((a, b) => b.rating.rate - a.rating.rate);
            }

            filteredProducts = result;
            render();
        };

        if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
        if (sortFilter) sortFilter.addEventListener('change', applyFilters);
        if (priceFilter) priceFilter.addEventListener('input', applyFilters);

        render();
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p class="text-center">Failed to load products.</p>';
    }
};

// Logic for Home Page Featured Products
let homeProducts = [];

const initHomePage = async () => {
    const featuredGrid = document.getElementById('featured-products');
    const homeSort = document.getElementById('home-sort');
    if (!featuredGrid) return;

    renderSkeletons(featuredGrid, 4);

    try {
        const products = await API.getProducts();
        homeProducts = [...products];

        const render = (data) => {
            featuredGrid.innerHTML = '';
            data.slice(0, 8).forEach(product => {
                featuredGrid.appendChild(createProductCard(product));
            });
        };

        if (homeSort) {
            homeSort.addEventListener('change', (e) => {
                let sorted = [...homeProducts];
                const val = e.target.value;

                if (val === 'price-asc') sorted.sort((a, b) => a.price - b.price);
                else if (val === 'price-desc') sorted.sort((a, b) => b.price - a.price);
                else if (val === 'rating-desc') sorted.sort((a, b) => b.rating.rate - a.rating.rate);
                else if (val === 'rating-asc') sorted.sort((a, b) => a.rating.rate - b.rating.rate);
                else if (val === 'newest') sorted.sort((a, b) => b.id - a.id);
                else if (val === 'az') sorted.sort((a, b) => a.title.localeCompare(b.title));
                else if (val === 'za') sorted.sort((a, b) => b.title.localeCompare(a.title));
                else if (val === 'relevant') sorted = [...homeProducts];
                
                render(sorted);
            });
        }

        render(homeProducts);
    } catch (error) {
        console.error(error);
        featuredGrid.innerHTML = '<p class="text-center">Failed to load featured products.</p>';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initProductsPage();
    initHomePage();
});
