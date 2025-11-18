import { fetchApi } from "./fetchApi.js";
import { API_CATEGORY } from "./constant.js";
import { params } from "./variable.js";
import { drawProducts } from "./drawProducts.js";

const categoryContainer = document.querySelector("#category");
const selectionTwo = document.querySelector(".selection-two");

//ktra element
if(!categoryContainer)
{
    console.error("Không tìm thấy category container");
}

//gắn icon cho đẹp hehe
const category_icon = {
    'Áo': 'fa-shirt',
    'Quần': 'fa-person-dress',
    'Váy': 'fa-user-tie',
    'Đầm': 'fa-person-dress',
    'Áo khoác': 'fa-vest',
    'Phụ kiện': 'fa-bag-shopping'
};

//load và render category
fetchApi(API_CATEGORY)
    .then(data => {
        let htmls = [
            `<div class="category-item active" data-category="">
                <i class="fa-solid fa-list"></i> Tất cả
            </div>`
        ];

       htmls = htmls.concat(
            data.map(item => {
                const icon = category_icon[item.name] || 'fa-tag';
                return `
                    <div class="category-item" data-category="${item.name}">
                        <i class="fa-solid ${icon}"></i> ${item.name}
                    </div>
                `;
            })
        );

        categoryContainer.innerHTML = htmls.join("");

        setupCategoryEvents(); 
    })
    .catch(error => {
        console.error("lỗi load category:",error);
        categoryContainer.innerHTML = `
            <p style ="color: #e74c3c; text-align: center;">
                không thể tải danh mục sp
            </p>
        `;
    });

function setupCategoryEvents()
{
    const categoryItems = document.querySelectorAll("#category .category-item");

    categoryItems.forEach(item => {
        item.addEventListener("click", function() {
            const selectedCategory = this.dataset.category;

            console.log("category clicked:", selectedCategory || "Tất cả");

            categoryItems.forEach(category => category.classList.remove("active"));
            this.classList.add("active");

            params.category = selectedCategory;
            params.page = 1;

            console.log("update params:", params);
            drawProducts();

            //ẩn slider
            if(selectionTwo)
            {
                if(selectedCategory === "" || !selectedCategory)
                {
                    // selectionTwo.style.display = "block";
                    selectionTwo.style.visibility = "visible";
                    selectionTwo.style.height = "auto";
                    selectionTwo.style.opacity = "1";
                }
                else{
                   //selectionTwo.style.display = "none";
                    selectionTwo.style.visibility = "hidden";
                    selectionTwo.style.height = "0";
                    selectionTwo.style.opacity = "0";
                 }
            }
            else{
                console.warn("ko tìm thấy selection-two");
            }

            //chức năng smooth scroll
            setTimeout(() => {
                const productsSelection = document.querySelector("#products-list");
                if(productsSelection)
                {
                    productsSelection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                    console.log("scroll xuống danh sách sp");
                }
            },100); 
        });
    });
    console.log("category events đã được thêm vào")
}