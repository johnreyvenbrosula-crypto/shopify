

const ShopNowDB = {

  
 
  getUser: function() {
    const email = localStorage.getItem('shopnow_user_email');
    const name = localStorage.getItem('shopnow_user_name');
    const phone = localStorage.getItem('shopnow_user_phone');
    const created = localStorage.getItem('shopnow_user_created');
    
    if (!email) return null;
    
    return {
      email: email,
      name: name || 'User',
      phone: phone || '',
      created: created || null,
      isNew: created === null
    };
  },
  
 
  hasUser: function() {
    return localStorage.getItem('shopnow_user_email') !== null;
  },
  
  
  createUser: function(email, name, phone) {
    localStorage.setItem('shopnow_user_email', email);
    localStorage.setItem('shopnow_user_name', name);
    localStorage.setItem('shopnow_user_phone', phone || '');
    localStorage.setItem('shopnow_user_created', new Date().toISOString());
    
    return this.getUser();
  },
  

  updateUser: function(data) {
    if (data.name) localStorage.setItem('shopnow_user_name', data.name);
    if (data.email) localStorage.setItem('shopnow_user_email', data.email);
    if (data.phone !== undefined) localStorage.setItem('shopnow_user_phone', data.phone);
    
    return this.getUser();
  },
  
  
  deleteUser: function() {
    localStorage.removeItem('shopnow_user_email');
    localStorage.removeItem('shopnow_user_name');
    localStorage.removeItem('shopnow_user_phone');
    localStorage.removeItem('shopnow_user_created');
  },

  getCart: function() {
    const cart = localStorage.getItem('shopnow_cart');
    return cart ? JSON.parse(cart) : [];
  },
  

  saveCart: function(items) {
    localStorage.setItem('shopnow_cart', JSON.stringify(items));
  },
  

  addToCart: function(product, qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        cat: product.cat,
        price: product.price,
        emoji: product.emoji,
        bg: product.bg,
        qty: qty
      });
    }
    
    this.saveCart(cart);
    return cart;
  },
  
  
  updateCartQty: function(productId, qty) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    
    if (item) {
      if (qty <= 0) {
        return this.removeFromCart(productId);
      }
      item.qty = qty;
      this.saveCart(cart);
    }
    
    return cart;
  },
  
  removeFromCart: function(productId) {
    const cart = this.getCart().filter(item => item.id !== productId);
    this.saveCart(cart);
    return cart;
  },
  
  
  clearCart: function() {
    this.saveCart([]);
  },
  
 
  getCartTotal: function() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  },
  

  getCartCount: function() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.qty, 0);
  },
  
  
  getOrders: function() {
    const orders = localStorage.getItem('shopnow_orders');
    return orders ? JSON.parse(orders) : [];
  },
  
 
  getLatestOrder: function() {
    const orders = this.getOrders();
    return orders.length > 0 ? orders[orders.length - 1] : null;
  },
  
 
  getOrder: function(orderId) {
    const orders = this.getOrders();
    return orders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase()) || null;
  },
  
  
  createOrder: function(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      orderId: Math.random().toString(36).substr(2, 10).toUpperCase(),
      date: new Date().toISOString(),
      customer: orderData.customer,
      shipping: orderData.shipping,
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      total: orderData.total,
      status: 'processing'
    };
    
    console.log('=== CREATING ORDER ===');
    console.log('Order data:', newOrder);
    
    orders.push(newOrder);
    localStorage.setItem('shopnow_orders', JSON.stringify(orders));
    
    console.log('Orders saved:', orders.length);
    console.log('New order ID:', newOrder.orderId);
    
  
    this.clearCart();
    
    return newOrder;
  },
  
 
  isNewUser: function() {
    return !this.hasUser();
  },
  
  
  hasOrders: function() {
    return this.getOrders().length > 0;
  },
  
  
  getUserStats: function() {
    const orders = this.getOrders();
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);
    
    return {
      orderCount: orders.length,
      totalSpent: totalSpent,
      totalItems: totalItems
    };
  },
  
 
  resetAll: function() {
    localStorage.removeItem('shopnow_user_email');
    localStorage.removeItem('shopnow_user_name');
    localStorage.removeItem('shopnow_user_phone');
    localStorage.removeItem('shopnow_user_created');
    localStorage.removeItem('shopnow_cart');
    localStorage.removeItem('shopnow_orders');
  }
};


window.ShopNowDB = ShopNowDB;