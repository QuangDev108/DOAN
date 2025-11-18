import { fetchApi } from "./fetchApi.js";
import { API_PRODUCTS } from "./constant.js";
import { params, buildURL, FILTER_MODE } from "./variable.js";
import cart from "./cart.js";

const productsContainer = document.querySelector("#products");

export const drawProducts = () => {
    if (!productsContainer) {
        console.error('❌ Products container not found');
        return;
    }

    console.log('🔥 ===== DRAW PRODUCTS =====');
    console.log('Mode:', FILTER_MODE);
    console.log('Params:', params);

    // Loading
    productsContainer.innerHTML = `
        <div style="width: 100%; text-align: center; padding: 40px; grid-column: 1/-1;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; color: #3498db;"></i>
            <p style="margin-top: 20px; color: #7f8c8d;">Đang tải sản phẩm...</p>
        </div>
    `;

    // ⭐ CHỌN CÁCH FILTERING DỰA VÀO MODE
    if (FILTER_MODE === "server") {
        // ===== SERVER-SIDE FILTERING =====
        drawProductsServerSide();
    } else {
        // ===== CLIENT-SIDE FILTERING =====
        drawProductsClientSide();
    }
};

// ===== SERVER-SIDE: Dùng buildURL =====
function drawProductsServerSide() {
    const apiURL = buildURL(API_PRODUCTS);

    fetchApi(apiURL)
        .then(data => {
            console.log('✅ Server-side:', data.length, 'products');
            renderProducts(data);
        })
        .catch(error => {
            console.error('❌ Error:', error);
            showError();
        });
}

// ===== CLIENT-SIDE: Filter toàn bộ =====
function drawProductsClientSide() {
    fetchApi(API_PRODUCTS)
        .then(allData => {
            console.log('📦 Fetched all:', allData.length, 'products');

            let filtered = [...allData];

            // 1. Filter category
            if (params.category && params.category !== "") {
                filtered = filtered.filter(item => item.type === params.category);
                console.log('After category:', filtered.length);
            }

            // 2. Search (bỏ dấu tiếng Việt)
            if (params.q && params.q.trim() !== "") {
                const searchTerm = removeVietnameseTones(params.q.toLowerCase());
                filtered = filtered.filter(item => {
                    const itemName = removeVietnameseTones(item.name.toLowerCase());
                    return itemName.includes(searchTerm);
                });
                console.log('After search:', filtered.length);
            }

            // 3. Filter price
            if (params.priceMin !== null) {
                filtered = filtered.filter(item => item.price >= params.priceMin);
            }
            if (params.priceMax !== null) {
                filtered = filtered.filter(item => item.price <= params.priceMax);
            }
            console.log('After price filter:', filtered.length);

            // 4. Sort
            if (params.sort && params.sort !== "") {
                filtered.sort((a, b) => {
                    let compareA = a[params.sort];
                    let compareB = b[params.sort];

                    if (typeof compareA === 'string') {
                        compareA = compareA.toLowerCase();
                        compareB = compareB.toLowerCase();
                    }

                    return params.order === "asc" 
                        ? (compareA > compareB ? 1 : -1)
                        : (compareA < compareB ? 1 : -1);
                });
                console.log('After sort:', params.sort, params.order);
            }

            // 5. Pagination
            const totalProducts = filtered.length;
            const startIndex = (params.page - 1) * params.limit;
            const endIndex = startIndex + params.limit;
            const paginated = filtered.slice(startIndex, endIndex);

            console.log(`✅ Client-side: Page ${params.page} | ${paginated.length} of ${totalProducts}`);

            // Update count
            updateProductCount(totalProducts);

            // Render
            renderProducts(paginated);
        })
        .catch(error => {
            console.error('❌ Error:', error);
            showError();
        });
}

// ===== RENDER PRODUCTS (Dùng chung cho cả 2 mode) =====
function renderProducts(data) {
    if (!data || data.length === 0) {
        productsContainer.innerHTML = `
            <div style="width: 100%; text-align: center; padding: 60px 20px; grid-column: 1/-1;">
                <i class="fa-solid fa-box-open" style="font-size: 80px; color: #ddd;"></i>
                <h3 style="margin: 20px 0; color: #2c3e50;">Không tìm thấy sản phẩm</h3>
                <p style="color: #7f8c8d;">Thử tìm kiếm với từ khóa khác</p>
            </div>
        `;
        return;
    }

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
    attachBuyButtons();

    console.log('✅ Render completed!');
}

// ===== HELPER FUNCTIONS =====
function removeVietnameseTones(str) {
    if (!str) return '';
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    return str;
}

function updateProductCount(count) {
    const countElement = document.querySelector('#products-count strong');
    if (countElement) {
        countElement.textContent = count;
    }
}

function showError() {
    productsContainer.innerHTML = `
        <div style="width: 100%; text-align: center; padding: 40px; color: #e74c3c; grid-column: 1/-1;">
            <i class="fa-solid fa-exclamation-circle" style="font-size: 48px;"></i>
            <p style="margin-top: 20px;">Không thể tải sản phẩm. Vui lòng thử lại!</p>
        </div>
    `;
}

function attachBuyButtons() {
    const buyButtons = document.querySelectorAll('.btn-checkout');
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            try {
                const product = JSON.parse(button.dataset.product);
                cart.addToCart(product);
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
}