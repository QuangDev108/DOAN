import { fetchApi } from "./fetchApi.js";

class shoppingCart {
  constructor() {
    this.cart = this.getCart();
    this.init();
  }

  //Lấy dữ liệu từ localstorage
  getCart() {
    return JSON.parse(localStorage.getItem('cart')) || []
  }

  //Lưu dữ liệu vô localstorage
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  //Thêm sản phẩm vô cart
  addToCart(product) {
    const existingProduct = this.cart.find(item => item.id === product.id);

    if (existingProduct)
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    else {
      this.cart.push({
        ...product,
        quantity: 1
      });
    }

    this.saveCart();
    this.updateCartCount();
    this.showNotification(' Đã thêm vào giỏ hàng!', 'success');
  }

  //Hàm xóa sản phẩm
  removeFromCart(productId) {
    console.log('Đang xóa sản phẩm ID:', productId, 'Type:', typeof productId);
    console.log('Giỏ hàng trước khi xóa:', this.cart);

    //====Chuyển về cùng kiểu string để so sánh ==========
    this.cart = this.cart.filter(item => {
      const itemId = String(item.id);
      const removeId = String(productId);
      console.log(`So sánh: '${itemId}' !== '${removeId}' = ${itemId !== removeId}`);
      return itemId !== removeId;
    });

    console.log('Giỏ hàng sau khi xóa:', this.cart);

    this.saveCart();
    this.displayCart();
    this.updateCartCount();
    this.showNotification(' Đã xóa sản phẩm!', 'info');
  }

  //Nút xóa tất cả
  clearCart() {
    if (confirm('Bạn muốn xóa tất cả sản phẩm không?')) {
      this.cart = [];
      this.saveCart();
      this.displayCart();
      this.updateCartCount();
      this.showNotification('Đã xóa tất cả!', 'info');
    }
  }

  //tính tổng
  calculateTotal() {
    return this.cart.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  }

  getTotalItems() {
    return this.cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  //chỉnh giá sang vnd
  formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
  }

  //render sản phẩm trong giỏ
  displayCart() {
    const cartListElement = document.querySelector('#cart-items-list');

    if (!cartListElement) return;

    if (this.cart.length === 0) {
      cartListElement.innerHTML = `
      <div class='empty-cart' style='text-align: center; padding: 60px 20px;'>
          <i class='fa-solid fa-cart-shopping' style='font-size: 80px; color: #ddd;'></i>
          <h3 style='margin: 20px 0 10px; color: #2c3e50;'>Giỏ hàng trống</h3>
          <p style='color: #7f8c8d; margin-bottom: 30px;'>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <a href='index.html' class='button-three'>
            <i class='fa-solid fa-arrow-left'></i> Tiếp tục mua sắm
          </a>
        </div>
      `;

      this.updateSummary();
      return;
    }

    //render sản phẩm
    cartListElement.innerHTML = this.cart.map(item => `
      <div class='cart-item' data-product-id='${item.id}' style='display: flex; align-items: center; padding: 20px; border-bottom: 1px solid #ecf0f1; gap: 20px;'>
        <div style='width: 100px; height: 100px; flex-shrink: 0;'>
          <img src='${item.image}' alt='${item.name}' style='width: 100%; height: 100%; object-fit: cover; border-radius: 8px;'>
        </div>
        
        <div style='flex: 1;'>
          <h4 style='font-size: 18px; color: #2c3e50; margin-bottom: 8px;'>${item.name}</h4>
          <p style='color: #e74c3c; font-size: 18px; font-weight: bold;'>${this.formatPrice(item.price)}</p>
        </div>
        
        <div style='text-align: center; min-width: 100px;'>
          <p style='font-size: 16px; margin: 0;'>
            Số lượng: <strong>${item.quantity}</strong>
          </p>
        </div>
        
        <div style='min-width: 120px; text-align: right;'>
          <p style='font-size: 20px; font-weight: bold; color: #e74c3c; margin: 0;'>
            ${this.formatPrice(item.price * item.quantity)}
          </p>
        </div>
        
        <div>
          <button 
            class='btn-remove' 
            data-id='${item.id}' 
            style='background: none; border: none; color: #e74c3c; font-size: 20px; cursor: pointer; transition: 0.3s;' 
            title='Xóa sản phẩm'
            onmouseover="this.style.transform='scale(1.2)'"
            onmouseout="this.style.transform='scale(1)'"
          >
            <i class='fa-solid fa-trash'></i>
          </button>
        </div>
      </div>
      `).join('');

    this.updateSummary();
  }

  updateSummary() {
    const subtotal = this.calculateTotal();
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const totalItemsEl = document.getElementById('total-items');
    if (totalItemsEl)
      totalItemsEl.textContent = this.getTotalItems();

    const subtotalEl = document.getElementById('subtotal');
    if (subtotalEl)
      subtotalEl.textContent = this.formatPrice(subtotal);

    const shippingFeeEl = document.getElementById('shipping');
    if (shippingFeeEl) {
      shippingFeeEl.innerHTML = shippingFee === 0 ?
        '<span style = "color: #27ae60;">Miễn phí</span>'
        : this.formatPrice(shippingFee);
    }

    const totalEl = document.getElementById('total');
    if (totalEl)
      totalEl.textContent = this.formatPrice(total);
  }

  updateCartCount() {
    const cartBadges = document.querySelectorAll('.cart-badge');
    const totalItems = this.getTotalItems();

    cartBadges.forEach(badge => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
  }


  //Dùng EVENT DELEGATION - Gắn event vào container cha
  setupEventDelegation() {
    const cartListElement = document.querySelector('#cart-items-list');
    if (!cartListElement) return;

    // Xóa event listener cũ nếu có (tránh duplicate)
    cartListElement.replaceWith(cartListElement.cloneNode(true));
    const newCartList = document.querySelector('#cart-items-list');

    newCartList.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.btn-remove');

      if (removeBtn) {
        const productId = parseInt(removeBtn.dataset.id);
        console.log('Click vào nút xóa!');
        console.log('Product ID:', productId);
        console.log('Type:', typeof productId);

        this.removeFromCart(productId);
      }
    });
    console.log('Event delegation đã dc setup!');
  }

  checkOut() {
    if (this.cart.length === 0) {
      alert('giỏ hàng trống');
      return;
    }

    const total = this.calculateTotal() + (this.calculateTotal() >= 500000 ? 0 : 30000);

    const confirmed = confirm(
      `Xác nhận thanh toán ${this.formatPrice(total)}?\n\n` +
      `Số lượng sản phẩm: ${this.getTotalItems()}`
    );

    if (confirmed) {
      this.showNotification(' Đặt hàng thành công!', 'success');

      setTimeout(() => {
        this.cart = [];
        this.saveCart();
        window.location.href = 'index.html';
      }, 2000);
    }
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
    <i class = 'fa-solid ${type == 'success' ? 'fa-check-circle' : 'fa-info-circle'}'></i>
    <span>${message}</span>
    `;

    notification.style.cssText = `
    position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#27ae60' : '#3498db'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  init() {
    this.updateCartCount();

    if (document.querySelector('#cart-items-list')) {
      this.displayCart();
      this.setupEventDelegation();
    }

    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn)
      clearCartBtn.addEventListener('click', () => this.clearCart());

    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn)
      checkoutBtn.addEventListener('click', () => this.checkOut());
  }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Khởi tạo và export
const cart = new shoppingCart();
export default cart;