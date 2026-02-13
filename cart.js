// Cart and checkout functionality

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
    if (window.location.pathname.includes('checkout.html')) {
        renderCheckoutPage();
    }
});

function renderCartPage() {
    const cart = JSON.parse(localStorage.getItem('mototuf_cart')) || [];
    const container = document.getElementById('cart-items-container');
    const totalSpan = document.getElementById('cart-total-price');

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
        if (totalSpan) totalSpan.textContent = '$0.00';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="remove-btn">Remove</button>
            </div>
        `;
    }).join('');

    totalSpan.textContent = `$${total.toFixed(2)}`;

    // Attach event listeners
    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', e => {
            const cartItem = e.target.closest('.cart-item');
            const id = cartItem.dataset.id;
            updateCartItemQuantity(id, -1);
        });
    });

    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', e => {
            const cartItem = e.target.closest('.cart-item');
            const id = cartItem.dataset.id;
            updateCartItemQuantity(id, 1);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const cartItem = e.target.closest('.cart-item');
            const id = cartItem.dataset.id;
            removeCartItem(id);
        });
    });
}

function updateCartItemQuantity(productId, delta) {
    let cart = JSON.parse(localStorage.getItem('mototuf_cart')) || [];
    let products = JSON.parse(localStorage.getItem('mototuf_products')) || [];
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (!product || !cartItem) return;

    const newQty = cartItem.quantity + delta;
    if (newQty <= 0) {
        // Remove item
        cart = cart.filter(item => item.id !== productId);
        // Restore stock
        product.stock += cartItem.quantity;
    } else if (newQty > product.stock + cartItem.quantity) {
        alert('Not enough stock.');
        return;
    } else {
        // Adjust stock
        const stockDiff = delta > 0 ? -1 : 1; // plus: decrease stock, minus: increase stock
        product.stock -= delta;
        cartItem.quantity = newQty;
    }

    localStorage.setItem('mototuf_products', JSON.stringify(products));
    localStorage.setItem('mototuf_cart', JSON.stringify(cart));
    updateCartCount();
    renderCartPage(); // Re-render
}

function removeCartItem(productId) {
    let cart = JSON.parse(localStorage.getItem('mototuf_cart')) || [];
    let products = JSON.parse(localStorage.getItem('mototuf_products')) || [];
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if (cartItem && product) {
        product.stock += cartItem.quantity;
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('mototuf_products', JSON.stringify(products));
        localStorage.setItem('mototuf_cart', JSON.stringify(cart));
        updateCartCount();
        renderCartPage();
    }
}

// Checkout page
function renderCheckoutPage() {
    const cart = JSON.parse(localStorage.getItem('mototuf_cart')) || [];
    const itemsDiv = document.getElementById('checkout-order-items');
    const totalSpan = document.getElementById('checkout-total');

    if (cart.length === 0) {
        window.location.href = 'shop.html';
        return;
    }

    let total = 0;
    itemsDiv.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `<div class="order-item"><span>${item.name} x${item.quantity}</span><span>$${(item.price * item.quantity).toFixed(2)}</span></div>`;
    }).join('');

    totalSpan.textContent = `$${total.toFixed(2)}`;

    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        placeOrder(cart, total);
    });
}

function placeOrder(cart, total) {
    const orders = JSON.parse(localStorage.getItem('mototuf_orders')) || [];
    const newOrder = {
        id: 'ORD' + Date.now(),
        date: new Date().toISOString(),
        items: cart,
        total: total,
        status: 'Pending',
        customer: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value
        }
    };
    orders.unshift(newOrder);
    localStorage.setItem('mototuf_orders', JSON.stringify(orders));

    // Clear cart
    localStorage.setItem('mototuf_cart', JSON.stringify([]));
    updateCartCount();
    alert('Order placed successfully!');
    window.location.href = 'orders.html';
}