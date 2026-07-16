// ===================================
// APP.JS - Main Application Logic
// ===================================

// Global variables
let currentUser = null;
let cart = [];
let currentFilter = 'all';
let allMenuItems = [];

// Initialize app on page load
window.addEventListener('load', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    
    if (userId && username) {
        currentUser = {
            id: userId,
            username: username
        };
        updateAuthUI();
        updateOrderCount();
    }
    
    // Load menu items
    loadMenuItems();
    
    // Load cart from localStorage
    loadCartFromStorage();
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.category;
            filterMenuItems();
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', searchMenuItems);
    }
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function loadMenuItems() {
    // Mock menu data for demonstration
    allMenuItems = [
        {
            id: 1,
            name: 'Margherita Pizza',
            category: 'Pizza',
            price: 1079,
            description: 'Fresh mozzarella and tomato sauce',
            image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop',
            emoji: '🍕'
        },
        {
            id: 2,
            name: 'Pepperoni Pizza',
            category: 'Pizza',
            price: 1100,
            description: 'Loaded with pepperoni and cheese',
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=300&fit=crop',
            emoji: '🍕'
        },
        {
            id: 3,
            name: 'Caesar Salad',
            category: 'Salads',
            price: 700,
            description: 'Fresh greens with Caesar dressing',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
            emoji: '🥗'
        },
        {
            id: 4,
            name: 'Garden Salad',
            category: 'Salads',
            price: 600,
            description: 'Mixed vegetables with vinaigrette',
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
            emoji: '🥗'
        },
        {
            id: 5,
            name: 'Burger Deluxe',
            category: 'Burgers',
            price: 900,
            description: 'Double patty with all toppings',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
            emoji: '🍔'
        },
        {
            id: 6,
            name: 'Classic Burger',
            category: 'Burgers',
            price: 829,
            description: 'Traditional burger with fresh toppings',
            image: 'https://images.unsplash.com/photo-1550547990-25967503a948?w=400&h=300&fit=crop',
            emoji: '🍔'
        },
        {
            id: 7,
            name: 'Iced Tea',
            category: 'Beverages',
            price: 248,
            description: 'Refreshing iced tea with lemon',
            image: 'https://images.unsplash.com/photo-1556765015-b552f08d0399?w=400&h=300&fit=crop',
            emoji: '🥤'
        },
        {
            id: 8,
            name: 'Orange Juice',
            category: 'Beverages',
            price: 289,
            description: 'Fresh squeezed orange juice',
            image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
            emoji: '🥤'
        },
        {
            id: 9,
            name: 'Chocolate Cake',
            category: 'Desserts',
            price: 497,
            description: 'Rich chocolate with ganache topping',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
            emoji: '🍰'
        },
        {
            id: 10,
            name: 'Cheesecake',
            category: 'Desserts',
            price: 580,
            description: 'Creamy cheesecake with berry sauce',
            image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=300&fit=crop',
            emoji: '🍰'
        }
    ];
    
    displayMenuItems(allMenuItems);
}

function displayMenuItems(items) {
    const menuGrid = document.getElementById('menu-grid');
    
    if (items.length === 0) {
        menuGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No items found</p>';
        return;
    }
    
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-card" onclick="openItemModal(${item.id})">
            <div class="menu-card-image" style="background-image: url('${item.image}'); background-size: cover; background-position: center;">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; display: none;">
            </div>
            <div class="menu-card-content">
                <div class="menu-card-header">
                    <h3>${item.name}</h3>
                    <div class="menu-card-price">₹${item.price}</div>
                </div>
                <span class="menu-card-category">${item.category}</span>
                <p class="menu-card-description">${item.description}</p>
                <div class="menu-card-footer">
                    <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${item.id})">
                        Add to Cart
                    </button>
                    <button class="btn-favorite" onclick="event.stopPropagation(); toggleFavorite(this)">❤️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterMenuItems() {
    if (currentFilter === 'all') {
        displayMenuItems(allMenuItems);
    } else {
        const filtered = allMenuItems.filter(item => item.category === currentFilter);
        displayMenuItems(filtered);
    }
}

function searchMenuItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filtered = allMenuItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
    displayMenuItems(filtered);
}

function openItemModal(itemId) {
    const item = allMenuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const itemDetails = document.getElementById('item-details');
    itemDetails.innerHTML = `
        <div class="item-details-image" style="background-image: url('${item.image}'); background-size: cover; background-position: center; border-radius: 10px;">
        </div>
        <h3>${item.name}</h3>
        <span class="item-details-category">${item.category}</span>
        <div class="item-details-price">₹${item.price}</div>
        <p class="item-details-description">${item.description}</p>
        
        <div class="quantity-selector">
            <button onclick="updateQuantity(-1)">-</button>
            <input type="number" id="item-quantity" value="1" min="1" max="100">
            <button onclick="updateQuantity(1)">+</button>
        </div>
        
        <button class="btn-primary btn-large" onclick="addToCartFromModal(${item.id})">
            Add to Cart
        </button>
    `;
    
    document.getElementById('item-modal').classList.add('show');
}

function closeItemModal() {
    document.getElementById('item-modal').classList.remove('show');
}

function updateQuantity(change) {
    const input = document.getElementById('item-quantity');
    const newValue = Math.max(1, parseInt(input.value) + change);
    input.value = newValue;
}

function addToCartFromModal(itemId) {
    const quantity = parseInt(document.getElementById('item-quantity').value);
    for (let i = 0; i < quantity; i++) {
        addToCart(itemId);
    }
    closeItemModal();
}

function addToCart(itemId) {
    if (!currentUser) {
        showAuthModal();
        return;
    }
    
    const item = allMenuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(c => c.id === itemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: itemId,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    
    // Show feedback
    showNotification(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCartToStorage();
    updateCartUI();
}

function updateCartQuantity(itemId, quantity) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCartToStorage();
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    cart = saved ? JSON.parse(saved) : [];
    updateCartUI();
}

function showCart() {
    if (!currentUser) {
        showAuthModal();
        return;
    }
    
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
    } else {
        let total = 0;
        cartItems.innerHTML = cart.map(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" value="${item.quantity}" onchange="updateCartQuantity(${item.id}, this.value)">
                        <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button onclick="removeFromCart(${item.id})" style="background: var(--danger-color); margin-left: 0.5rem;">Remove</button>
                    </div>
                </div>
            `;
        }).join('');
        
        document.getElementById('cart-total').textContent = Math.round(total);
    }
    
    document.getElementById('cart-modal').classList.add('show');
}

function closeCartModal() {
    document.getElementById('cart-modal').classList.remove('show');
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    if (!currentUser) {
        showAuthModal();
        return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Show confirmation
    const confirmed = confirm(`Place order for ₹${total}? (${itemCount} items)`);
    
    if (confirmed) {
        // Create order object
        const order = {
            id: generateOrderId(),
            userId: currentUser.id,
            items: [...cart],
            total_amount: total,
            item_count: itemCount,
            status: 'Confirmed',
            created_at: new Date().toISOString(),
            estimated_delivery: getEstimatedDelivery()
        };
        
        // Save order
        saveOrder(order);
        
        // Clear cart and show success
        cart = [];
        saveCartToStorage();
        updateCartUI();
        closeCartModal();
        updateOrderCount();
        
        showNotification(`Order #${order.id} placed successfully! Check your orders page for tracking.`);
    }
}

// ===================================
// ORDER MANAGEMENT FUNCTIONS
// ===================================

function generateOrderId() {
    return 'ORD' + Date.now().toString().slice(-6);
}

function getEstimatedDelivery() {
    const delivered = new Date();
    delivered.setMinutes(delivered.getMinutes() + 30 + Math.random() * 30);
    return delivered.toISOString();
}

function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`) || '[]');
    orders.push(order);
    localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(orders));
}

function getOrders(userId) {
    return JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
}

function getOrderCount(userId) {
    const orders = getOrders(userId);
    return orders.length;
}

function updateOrderCount() {
    if (currentUser) {
        const orderCount = getOrderCount(currentUser.id);
        const orderLink = document.querySelector('a[href="order-tracking.html"]');
        if (orderLink) {
            orderLink.innerHTML = `📦 Orders (${orderCount})`;
        }
    }
}

function showAuthModal() {
    document.getElementById('auth-modal').classList.add('show');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('show');
}

function switchAuthTab(tab) {
    document.getElementById('login-tab').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('register-tab').style.display = tab === 'register' ? 'block' : 'none';
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    // Mock authentication - in production, call backend API
    if (username && password) {
        currentUser = {
            id: Date.now(),
            username: username
        };
        
        localStorage.setItem('userId', currentUser.id);
        localStorage.setItem('username', username);
        
        updateAuthUI();
        closeAuthModal();
        showNotification(`Welcome back, ${username}!`);
        
        // Clear form
        document.getElementById('login-form').reset();
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Mock registration - in production, call backend API
    if (username && email && password) {
        currentUser = {
            id: Date.now(),
            username: username
        };
        
        localStorage.setItem('userId', currentUser.id);
        localStorage.setItem('username', username);
        
        updateAuthUI();
        closeAuthModal();
        showNotification(`Welcome, ${username}! Account created successfully.`);
        
        // Clear form
        document.getElementById('register-form').reset();
        
        // Switch to login tab
        switchAuthTab('login');
    }
}

function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (currentUser) {
        authBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        logoutBtn.textContent = `${currentUser.username} - Logout`;
        updateOrderCount();
    } else {
        authBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

function logout() {
    currentUser = null;
    cart = [];
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('cart');
    
    updateAuthUI();
    updateCartUI();
    showNotification('Logged out successfully');
}

function toggleFavorite(btn) {
    btn.style.transform = btn.style.transform === 'scale(1.2)' ? 'scale(1)' : 'scale(1.2)';
}

function showNotification(message) {
    // Simple notification (you could improve this with a proper toast library)
    alert(message);
}
