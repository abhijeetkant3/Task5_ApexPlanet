import API from './api.js';

export const setupSearch = () => {
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    
    if (!searchInput || !searchDropdown) return;

    let debounceTimer;

    const renderResults = (results) => {
        searchDropdown.innerHTML = '';
        if (results.length === 0) {
            searchDropdown.innerHTML = '<div class="search-item"><p>No products found.</p></div>';
        } else {
            results.slice(0, 5).forEach(product => {
                const item = document.createElement('a');
                item.href = `product.html?id=${product.id}`;
                item.className = 'search-item';
                item.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <p>${product.title}</p>
                `;
                searchDropdown.appendChild(item);
            });
        }
        searchDropdown.classList.add('active');
    };

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchDropdown.classList.remove('active');
            return;
        }

        debounceTimer = setTimeout(async () => {
            try {
                // In a real scenario we'd query the API directly if supported,
                // but FakeStore API doesn't have a search endpoint, so we filter cached data.
                const products = await API.getProducts();
                const filtered = products.filter(p => p.title.toLowerCase().includes(query));
                renderResults(filtered);
            } catch (error) {
                console.error('Search error:', error);
            }
        }, 300); // 300ms debounce
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchDropdown.classList.remove('active');
        }
    });
};

document.addEventListener('DOMContentLoaded', setupSearch);
