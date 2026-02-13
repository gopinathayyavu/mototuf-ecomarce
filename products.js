// Product listing, filtering, and detail logic

document.addEventListener('DOMContentLoaded', function () {
    const products = JSON.parse(localStorage.getItem('mototuf_products')) || [];

    // Handle product detail page
    if (window.location.pathname.includes('product.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const product = products.find(p => p.id === productId);

        if (product) {
            renderProductDetail(product);
        } else {
            document.getElementById('product-detail-container').innerHTML = '<p>Product not found.</p>';
        }
    }

    // Handle shop page with grid, filters
    if (window.location.pathname.includes('shop.html')) {
        renderShopPage(products);
    }
});

function renderProductDetail(product) {
    const container = document.getElementById('product-detail-container');
    container.innerHTML = `
        <div class="product-detail">
            <img src="${product.image}" alt="${product.name}" class="detail-image">
            <div class="detail-info">
                <h1>${product.name}</h1>
                <div class="detail-price">$${product.price.toFixed(2)}</div>
                <div class="detail-stock ${product.stock === 0 ? 'out-of-stock' : ''}">
                    ${product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </div>
                <p class="detail-description">${product.description}</p>
                <div class="quantity-selector">
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" min="1" max="${product.stock}" value="1" ${product.stock === 0 ? 'disabled' : ''}>
                </div>
                <button class="btn btn-primary" id="add-to-cart-detail" ${product.stock === 0 ? 'disabled' : ''}>
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    document.getElementById('add-to-cart-detail')?.addEventListener('click', () => {
        const qty = parseInt(document.getElementById('quantity').value) || 1;
        addToCart(product.id, qty);
    });
}

function addToCart(productId, quantity) {
    const products = JSON.parse(localStorage.getItem('mototuf_products')) || [];
    const product = products.find(p => p.id === productId);
    if (!product || product.stock < quantity) {
        alert('Insufficient stock!');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('mototuf_cart')) || [];
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        if (product.stock >= existing.quantity + quantity) {
            existing.quantity += quantity;
        } else {
            alert('Not enough stock available.');
            return;
        }
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: quantity });
    }

    // Reduce product stock
    product.stock -= quantity;
    localStorage.setItem('mototuf_products', JSON.stringify(products));
    localStorage.setItem('mototuf_cart', JSON.stringify(cart));
    updateCartCount();
    alert('Added to cart!');
}

function renderShopPage(products) {
    const grid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const paginationDiv = document.getElementById('pagination');

    let currentPage = 1;
    const itemsPerPage = 6;

    function filterAndSortProducts() {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const category = categoryFilter?.value || 'all';
        const sort = sortBy?.value || 'default';

        let filtered = products.filter(p =>
            (category === 'all' || p.category === category) &&
            (p.name.toLowerCase().includes(searchTerm))
        );

        if (sort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        }

        return filtered;
    }

    function displayPage() {
        const filtered = filterAndSortProducts();
        const start = (currentPage - 1) * itemsPerPage;
        const paginated = filtered.slice(start, start + itemsPerPage);
        grid.innerHTML = paginated.map(createProductCard).join('');

        // Pagination buttons
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        paginationDiv.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.classList.add('page-btn');
            if (i === currentPage) btn.classList.add('active');
            btn.textContent = i;
            btn.dataset.page = i;
            btn.addEventListener('click', () => {
                currentPage = i;
                displayPage();
            });
            paginationDiv.appendChild(btn);
        }
    }

    searchInput?.addEventListener('input', () => { currentPage = 1; displayPage(); });
    categoryFilter?.addEventListener('change', () => { currentPage = 1; displayPage(); });
    sortBy?.addEventListener('change', () => { currentPage = 1; displayPage(); });

    displayPage();
}