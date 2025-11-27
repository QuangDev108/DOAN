import { fetchApi } from "./fetchApi.js";
import { API_PRODUCTS } from "./constant.js";
import { params } from "./variable.js";
import cart from "./cart.js";

const productsContainer = document.querySelector("#products");

//hàm bỏ dấu của tiếng việt để tìm
function removeVietNameseTones(str)
{
    if(!str) return "";
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    return str;
}

export const drawProducts = () => {
    if (!productsContainer) {
        console.error(' Products container not found');
        return;
    }

    // Loading
    productsContainer.innerHTML = `
        <div style="width: 100%; text-align: center; padding: 40px; grid-column: 1/-1;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; color: #3498db;"></i>
            <p style="margin-top: 20px; color: #7f8c8d;">Đang tải sản phẩm...</p>
        </div>
    `;

    //Lấy sản phẩm từ API
    fetchApi(API_PRODUCTS)
        .then(allProducts => {
            //1. Lọc theo filter
            let filtered = allProducts;
            if(params.category && params.category !== "")
            {
                filtered = filtered.filter(item => item.type === params.category);
            }

            //2. Tìm kiếm theo tên
            if(params.q && params.q.trim() !== "")
            {
                const searchTerm = removeVietNameseTones(params.q.toLowerCase());
                filtered = filtered.filter(item => {
                    const itemName = removeVietNameseTones(item.name.toLowerCase());
                    return itemName.includes(searchTerm);
                });
            }

            //3. Sắp xếp
            if(params.sort && params.sort !== "")
            {
                filtered.sort((a,b) => {
                    let valueA = a[params.sort];
                    let valueB = b[params.sort];

                    //Nếu là text thì chuyển về chữ thường
                    if(typeof valueA === "string")
                    {
                        valueA = valueA.toLowerCase();
                        valueB = valueB.toLowerCase();
                    }

                    //So sánh theo thứ tự
                    if(params.order === "asc")
                    {
                        return valueA > valueB ? 1 : -1;
                    }
                    else
                    {
                        return valueA < valueB ? 1 : -1;
                    }
                });
            }

            //4. Phân trang
            const totalProducts = filtered.length;
            const startIndex = (params.page - 1) * params.limit; //Bắt đầu lấy từ sp nào
            const endIndex = startIndex + params.limit;
            const productsToShow = filtered.slice(startIndex, endIndex);

            console.log(` Trang ${params.page}: Hiển thị ${productsToShow.length}/${totalProducts} sản phẩm`);

            //Cập nhật số lượng sp
            // const countElement = document.querySelector("#products-count strong");
            // if(countElement)
            // {
            //     countElement.textContent = totalProducts;
            // }

            renderProducts(productsToShow);
        })
        .catch(error => {
            console.error("Lỗi: ", error);
            productsContainer.innerHTML = `
            <p style="margin-top: 20px;">Không thể tải sản phẩm. Vui lòng thử lại!</p>`;
        });

};


function renderProducts(products) 
{
    if(!products || products.length === 0)
    {
        productsContainer.innerHTML = `
            <div style="width: 100%; text-align: center; padding: 60px 20px; grid-column: 1/-1;">
                <i class="fa-solid fa-box-open" style="font-size: 80px; color: #ddd;"></i>
                <h3 style="margin: 20px 0; color: #2c3e50;">Không tìm thấy sản phẩm</h3>
                <p style="color: #7f8c8d;">Thử tìm kiếm với từ khóa khác</p>
            </div>
        `;
        return;
    }

    const htmlProducts = products.map(item => {
        return `
            <div class="product__item">
                <div class="product__image">
                    <img src="${item.image}" alt="${item.name}" 
                        onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
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

    productsContainer.innerHTML = htmlProducts.join("");
    addBuyButtonEvents();

}



function addBuyButtonEvents()
{
    const buyButtons = document.querySelectorAll(".btn-checkout");

    buyButtons.forEach(button => {
        button.addEventListener("click",() => {
            try 
            {
                const product = JSON.parse(button.dataset.product);
                cart.addToCart(product);
            } 
            catch (error)
            {
                console.error("lỗi khi thêm vào giỏ: ", error);
            }
        });
    });
}