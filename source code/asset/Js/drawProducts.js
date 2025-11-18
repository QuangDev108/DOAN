import { fetchApi } from "./fetchApi.js";
import { API_PRODUCTS } from "./constant.js";
import { params, buildURL } from "./variable.js";
import cart from "./cart.js";

const productsContainer = document.querySelector("#products");

export const drawProducts = () => {
    if (!productsContainer) {
        console.error('Products container not found');
        return;
    }

    // Xây dựng URL với các params
    const apiURL = buildURL(API_PRODUCTS);
    
    console.log('=== DRAW PRODUCTS ===');
    console.log('API URL:', apiURL);
    console.log('Params:', params);

    // Hiển thị loading
    productsContainer.innerHTML = `
        <div style="width: 100%; text-align: center; padding: 40px; grid-column: 1 / -1;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; color: #3498db;"></i>
            <p style="margin-top: 20px; color: #7f8c8d;">Đang tải sản phẩm...</p>
        </div>
    `;

    fetchApi(apiURL)
        .then(data => {
            console.log('Products loaded:', data.length, 'items');

            // Kiểm tra nếu không có sản phẩm
            if (!data || data.length === 0) {
                productsContainer.innerHTML = `
                    <div style="width: 100%; text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
                        <i class="fa-solid fa-box-open" style="font-size: 80px; color: #ddd;"></i>
                        <h3 style="margin: 20px 0; color: #2c3e50;">Không tìm thấy sản phẩm</h3>
                        <p style="color: #7f8c8d;">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                    </div>
                `;
                return;
            }

            // Render sản phẩm
            let htmls = data.map(item => {
                return `
                    <div class="product__item">
                        <div class="product__image">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
                            ${item.quantity < 5 ? '<span class="badge-hot">Sắp hết</span>' : ''}
                        </div>
                        <div class="product__content">
                            <h3 class="product__title">${item.name}</h3>
                            <div class="product__meta">
                                <div class="product__price">
                                    ${item.price.toLocaleString('vi-VN')}đ
                                </div>
                                <div class="product__stock">
                                    Còn lại: ${item.quantity}sp
                                </div>
                            </div>
                            <button class="btn-checkout" data-product='${JSON.stringify(item)}'>
                                <i class="fa-solid fa-cart-plus"></i> Mua ngay
                            </button>
                        </div>
                    </div>
                `;
            });

            productsContainer.innerHTML = htmls.join("");
            
            // Gắn event cho nút "Mua ngay"
            attachBuyButtons();

            console.log('Products rendered successfully');
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productsContainer.innerHTML = `
                <div style="width: 100%; text-align: center; padding: 40px; color: #e74c3c; grid-column: 1 / -1;">
                    <i class="fa-solid fa-exclamation-circle" style="font-size: 48px;"></i>
                    <p style="margin-top: 20px;">Không thể tải sản phẩm. Vui lòng thử lại sau!</p>
                    <p style="color: #95a5a6; font-size: 14px;">${error.message}</p>
                </div>
            `;
        });
};

// Hàm gắn sự kiện cho nút "Mua ngay"
function attachBuyButtons() {
    const buyButtons = document.querySelectorAll('.btn-checkout');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            try {
                const product = JSON.parse(button.dataset.product);
                
                // Thêm vào giỏ hàng
                cart.addToCart(product);
            } catch (error) {
                console.error('Error parsing product data:', error);
            }
        });
    });
}