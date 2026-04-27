


(function() {

  setTimeout(loadOrderData, 50);
})();

function loadOrderData() {
  try {
    console.log('=== TRACK ORDER DEBUG ===');
    console.log('ShopNowDB:', typeof ShopNowDB);
    

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    console.log('URL order param:', orderId);
    
    const allOrders = ShopNowDB.getOrders();
    console.log('All orders in DB:', allOrders);
    console.log('Order count:', allOrders.length);
    
    let order = null;
    
    if (orderId) {
  
      order = allOrders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
      console.log('Looking for order:', orderId, 'Result:', order);
    } else if (allOrders.length > 0) {
   
      order = allOrders[allOrders.length - 1];
      console.log('Using latest order:', order);
    }
    
    if (order) {
      displayOrder(order);
    } else {
    
      console.log('No order found. Checking localStorage directly...');
      const rawOrders = localStorage.getItem('shopnow_orders');
      console.log('Raw localStorage orders:', rawOrders);
      showNoOrderFound();
    }
  } catch (e) {
    console.error('Error loading order:', e);
    showNoOrderFound();
  }
}


function displayOrder(order) {
  console.log('Displaying order:', order);
  console.log('Order fields:', Object.keys(order));
  
 
  document.getElementById('orderId').textContent = order.orderId || 'N/A';
  
  
  const orderDate = new Date(order.date);
  console.log('Order date:', order.date, 'Parsed:', orderDate);
  document.getElementById('orderDate').textContent = orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  
  console.log('Order total:', order.total);
  document.getElementById('orderTotal').textContent = '$' + (order.total || 0).toFixed(2);
  
 
  console.log('Order items:', order.items);
  const totalItems = order.items.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('orderItems').textContent = totalItems + ' item' + (totalItems > 1 ? 's' : '');
  
 
  const shipping = order.shipping;
  console.log('Shipping:', shipping);
  document.getElementById('shippingAddress').textContent = 
    shipping.address + ', ' + shipping.city + ', ' + shipping.state + ' ' + shipping.zip;
  
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + Math.floor(Math.random() * 3) + 3);
  document.getElementById('estimatedDate').textContent = estimatedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  const itemsList = document.getElementById('itemsList');
  itemsList.innerHTML = order.items.map(item => `
    <div class="order-item">
      <div class="order-item-img" style="background:${item.bg}">${item.emoji}</div>
      <div class="order-item-info">
        <div class="order-item-name">${item.name}</div>
        <div class="order-item-qty">Qty: ${item.qty}</div>
      </div>
      <div class="order-item-price">$${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join('');
  
  
  simulateDeliveryProgress();
}


function showNoOrderFound() {
  document.getElementById('successMessage').innerHTML = `
    <div class="success-icon">🔍</div>
    <h1>Order Not Found</h1>
    <p>We couldn't find any order information. Please check your order history.</p>
  `;
  document.getElementById('orderId').textContent = '---';
  document.getElementById('orderDate').textContent = '---';
  document.getElementById('orderTotal').textContent = '$0.00';
  document.getElementById('orderItems').textContent = '0';
  document.getElementById('shippingAddress').textContent = '---';
  document.getElementById('itemsList').innerHTML = '<p style="text-align:center;color:var(--text2)">No order items found.</p>';
}


function simulateDeliveryProgress() {
  const steps = document.querySelectorAll('.status-step');
  const times = [
    document.getElementById('time1'),
    document.getElementById('time2'),
    document.getElementById('time3'),
    document.getElementById('time4'),
    document.getElementById('time5')
  ];
  

  const now = new Date();
  times[0].textContent = 'Just now';
  
 
  let currentStep = 0;
  
  const progressInterval = setInterval(() => {
   
    if (currentStep < steps.length) {
      steps[currentStep].classList.add('active');
      
   
      if (currentStep > 0) {
        const stepTime = new Date(now);
        stepTime.setMinutes(stepTime.getMinutes() + (currentStep * 15));
        times[currentStep].textContent = stepTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        });
      }
      
      currentStep++;
      
      if (currentStep >= steps.length) {
        clearInterval(progressInterval);
      }
    }
  }, 2000); 
}


let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}