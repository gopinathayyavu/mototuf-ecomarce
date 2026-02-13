// Admin panel functionality

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        renderDashboard();
    }
    if (window.location.pathname.includes('products.html')) {
        renderAdminProducts();
    }
    if (window.location.pathname.includes('orders.html')) {
        renderAdminOrders();
    }
});

function renderDashboard() {
    const products = JSON.parse(localStorage.getItem('mototuf_products')) || [];
    const orders = JSON.parse(localStorage.getItem('mototuf_orders')) || [];
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

    document.getElementById('admin-stats').innerHTML = `
        <div class="stat-card">
            <h3>Total Products</h3>
            <div class="stat-value">${products.length}</div>
        </div>
        <div class="stat-card">
            <h3>Total Orders</h3>
            <div class="stat-value">${orders.length}</div>
        </div>
        <div class="stat-card">
            <h3>Total Revenue</h3>
            <div class="stat-value">$${revenue.toFixed(2)}</div>
        </div>
    `;
}

function renderAdminProducts() {
    const products = JSON.parse(localStorage.getItem('mototuf_products')) || [];
    const tableDiv = document.getElementById('admin-products-table');
    
    tableDiv.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(p => `
                    <tr>
                        <td>${p.id}</td>
                        <td><img src="${p.image}" alt="${p.name}" style="width:50px; height:50px; object-fit:cover;"></td>
                        <td>${p.name}</td>
                        <td>${p.category}</td>
                        <td>$${p.price.toFixed(2)}</td>
                        <td>${p.stock}</td>
                        <td>
                            <button class="action-btn edit-btn" data-id="${p.id}">Edit</button>
                            <button class="action-btn delete-btn" data-id="${p.id}">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Edit/Delete listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', e => editProduct(e.target.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', e => deleteProduct(e.target.dataset.id));
    });

    // Show add form button
    document.getElementById('show-add-form').addEventListener('click', () => {
        document.getElementById('product-form-container').style.display = 'block';
        document.getElementById('admin-product-form').reset();
        document.getElementById('product-id').value = '';
    });

    document.getElementById('cancel-product-form').addEventListener('click', () => {
        document.getElementById('product-form-container').style.display = 'none';
    });

    // Save product
    document.getElementById('admin-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
}

function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('mototuf_products')) || [];
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-featured').checked = product.featured || false;

    document.getElementById('product-form-container').style.display = 'block';
}

function deleteProduct(id) {
    if (!confirm('Are you sure?')) return;
    let products = JSON.parse(localStorage.getItem('mototuf_products')) || [];
    products = products.filter(p => p.id !== id);
    localStorage.setItem('mototuf_products', JSON.stringify(products));
    renderAdminProducts();
}

function saveProduct() {
    const id = document.getElementById('product-id').value;
    const product = {
        id: id || 'prod_' + Date.now(),
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value,
        featured: document.getElementById('product-featured').checked
    };

    let products = JSON.parse(localStorage.getItem('mototuf_products')) || [];
    if (id) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) products[index] = product;
    } else {
        products.push(product);
    }

    localStorage.setItem('mototuf_products', JSON.stringify(products));
    document.getElementById('product-form-container').style.display = 'none';
    renderAdminProducts();
}

function renderAdminOrders() {
    const orders = JSON.parse(localStorage.getItem('mototuf_orders')) || [];
    const list = document.getElementById('admin-orders-list');
    
    list.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">${order.id}</span>
                <span>${new Date(order.date).toLocaleDateString()}</span>
                <select class="order-status-select" data-id="${order.id}">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                </select>
                <button class="action-btn delete-btn" data-id="${order.id}">Delete</button>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <strong>Total: $${order.total.toFixed(2)}</strong>
            </div>
        </div>
    `).join('');

    // Status change listeners
    document.querySelectorAll('.order-status-select').forEach(select => {
        select.addEventListener('change', e => {
            const orderId = e.target.dataset.id;
            const newStatus = e.target.value;
            updateOrderStatus(orderId, newStatus);
        });
    });

    // Delete order
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const orderId = e.target.dataset.id;
            deleteOrder(orderId);
        });
    });
}

function updateOrderStatus(orderId, status) {
    let orders = JSON.parse(localStorage.getItem('mototuf_orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('mototuf_orders', JSON.stringify(orders));
        renderAdminOrders();
    }
}

function deleteOrder(orderId) {
    if (!confirm('Delete this order?')) return;
    let orders = JSON.parse(localStorage.getItem('mototuf_orders')) || [];
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('mototuf_orders', JSON.stringify(orders));
    renderAdminOrders();
    renderDashboard(); // update stats if dashboard open
}