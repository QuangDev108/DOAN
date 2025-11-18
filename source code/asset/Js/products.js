import { fetchApi } from "./fetchApi.js";
import { API_PRODUCTS } from "./constant.js";
import cart from "./cart.js";
import { drawProducts } from "./drawProducts.js";

const productsContainer = document.querySelector("#products");

// fetchApi(API_PRODUCTS)
//   .then(data => {
//     let htmls = data.map(item => {
//       return `
//         <div class="product__item">
//           <div class="product__image">
//             <img src="${item.image}" alt="${item.name}">
//             ${item.quantity < 5 ? '<span class="badge-hot">Sắp hết</span>' : ''}
//           </div>
//           <div class="product__content">
//             <h3 class="product__title">${item.name}</h3>
//             <div class="product__meta">
//               <div class="product__price">
//                 ${item.price.toLocaleString('vi-VN')}đ
//               </div>
//               <div class="product__stock">
//                 Còn lại: ${item.quantity}sp
//               </div>
//             </div>
//             <button class="btn-checkout" data-product='${JSON.stringify(item)}'>
//               <i class="fa-solid fa-cart-plus"></i> Mua ngay
//             </button>
//           </div>
//         </div>
//       `})
    
//     productsContainer.innerHTML = htmls.join("");
    
//     // Thêm event listener cho tất cả nút "Mua ngay"
//     attachBuyButtons();
//   })

//   .catch(error => {
//     console.error('Error loading products:', error);
//     productsContainer.innerHTML = `
//       <div style="text-align: center; padding: 40px; color: #e74c3c;">
//         <i class="fa-solid fa-exclamation-circle" style="font-size: 48px;"></i>
//         <p style="margin-top: 20px;">Không thể tải sản phẩm. Vui lòng thử lại sau!</p>
//       </div>
//     `;
//   });

// // Hàm gắn sự kiện cho nút "Mua ngay"
// function attachBuyButtons() {
//   const buyButtons = document.querySelectorAll('.btn-checkout');
  
//   buyButtons.forEach(button => {
//     button.addEventListener('click', (e) => {
//       const product = JSON.parse(button.dataset.product);
      
//       // Thêm vào giỏ hàng
//       cart.addToCart(product);
      
//      // Tùy chọn: Hỏi có muốn xem giỏ hàng không
//       // const goToCart = confirm('Đã thêm vào giỏ hàng! Bạn có muốn xem giỏ hàng?');
//       // if (goToCart) {
//       //   window.location.href = 'cart.html';
//       // }
//     });
//   });
// }

drawProducts();