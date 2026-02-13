// ==================== GLOBAL DATA INIT ====================
const DEFAULT_PRODUCTS = [
    { id: '1', name: 'Full Face Helmet', category: 'helmets', price: 199.99, stock: 15, image: 'https://images.pexels.com/photos/2759779/pexels-photo-2759779.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'High-impact ABS shell, comfortable interior.', featured: true },
    { id: '2', name: 'Leather Rider Jacket', category: 'jackets', price: 299.99, stock: 8, image: 'https://images.pexels.com/photos/175538/pexels-photo-175538.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Genuine leather with armor pockets.', featured: true },
    { id: '3', name: 'Carbon Fiber Gloves', category: 'gloves', price: 49.99, stock: 25, image: 'https://images.pexels.com/photos/176646/pexels-photo-176646.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Ventilated, touchscreen compatible.', featured: true },
    { id: '4', name: 'Riding Boots', category: 'boots', price: 159.99, stock: 12, image: 'https://images.pexels.com/photos/1485519/pexels-photo-1485519.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Ankle protection, oil-resistant sole.', featured: true },
    { id: '5', name: 'Brake Pads Set', category: 'parts', price: 34.99, stock: 40, image: 'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Sintered metal, high performance.', featured: false },
    { id: '6', name: 'LED Headlight', category: 'lights', price: 89.99, stock: 20, image: 'https://images.pexels.com/photos/385997/pexels-photo-385997.jpeg?auto=compress&cs=tinysrgb&w=600', description: '6000K bright white, plug and play.', featured: false },
    { id: '7', name: 'Back Protector', category: 'protective', price: 79.99, stock: 18, image: 'https://images.pexels.com/photos/2703876/pexels-photo-2703876.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Level 2 certified, lightweight.', featured: false },
    { id: '8', name: 'Modular Helmet', category: 'helmets', price: 249.99, stock: 7, image: 'https://images.pexels.com/photos/1808943/pexels-photo-1808943.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Flip-up design, dual visor.', featured: false },
    { id: '9', name: 'Textile Jacket', category: 'jackets', price: 179.99, stock: 14, image: 'https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Waterproof, removable thermal liner.', featured: true },
    { id: '10', name: 'Short Gloves', category: 'gloves', price: 29.99, stock: 30, image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Mesh back, reinforced palm.', featured: false },
    { id: '11', name: 'Touring Boots', category: 'boots', price: 189.99, stock: 5, image: 'https://images.pexels.com/photos/2922307/pexels-photo-2922307.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Waterproof, reinforced toe.', featured: false },
    { id: '12', name: 'Engine Oil (1L)', category: 'parts', price: 12.99, stock: 100, image: 'https://images.pexels.com/photos/11164137/pexels-photo-11164137.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Fully synthetic, 10W-40.', featured: false }
];

// Initialize localStorage with default data if empty
if (!localStorage.getItem('mototuf_products')) {
    localStorage.setItem('mototuf_products', JSON.stringify(DEFAULT_PRODUCTS));
}
if (!localStorage.getItem('mototuf_cart')) {
    localStorage.setItem('mototuf_cart', JSON.stringify([]));
}
if (!localStorage.getItem('mototuf_orders')) {
    localStorage.setItem('mototuf_orders', JSON.stringify([]));
}

// ==================== HELPER FUNCTIONS ====================
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('mototuf_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cart-count-nav').forEach(el => {
        el.textContent = totalItems;
    });
}

// Product card HTML generator (reusable)
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-stock ${product.stock === 0 ? 'out-of-stock' : ''}">
                    ${product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                </div>
                <a href="product.html?id=${product.id}" class="btn btn-secondary" style="width:100%;">View Details</a>
            </div>
        </div>
    `;
}

// ==================== GLOBAL EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();

    // Mobile hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Category card clicks on homepage
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.cat;
            window.location.href = `shop.html?category=${category}`;
        });
    });
});