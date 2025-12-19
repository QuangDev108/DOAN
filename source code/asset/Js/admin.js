import { fetchApi } from "./fetchApi.js";
import { API_PRODUCTS, API_CATEGORY } from "./constant.js";
import { createProduct, updateProduct, deleteProduct, getProductById } from "./productsCRUD.js";
import { createCategory, updateCategory, deleteCategory, getCategoryById } from "./categoryCRUD.js";

console.log("🔐 Admin Panel loaded!");

// ========== BIẾN TOÀN CỤC ==========
let editingProductId = null;
let editingCategoryId = null;

// ========== DOM ELEMENTS ==========
const productsTableBody = document.getElementById("productsTableBody");
const categoriesTableBody = document.getElementById("categoriesTableBody");

const productModal = document.getElementById("productModal");
const categoryModal = document.getElementById("categoryModal");

const productForm = document.getElementById("productForm");
const categoryForm = document.getElementById("categoryForm");

// ========== TOAST THÔNG BÁO ==========
function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    toastMessage.textContent = message;
    toast.classList.remove("error");
    if (isError) toast.classList.add("error");

    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// ========== TABS ==========
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const tabName = btn.dataset.tab;

        // Remove active
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

        // Add active
        btn.classList.add("active");
        document.getElementById(`${tabName}-tab`).classList.add("active");
    });
});



// ==========================================
//          QUẢN LÝ SẢN PHẨM
// ==========================================

// Load danh sách sản phẩm
async function loadProducts() {
    productsTableBody.innerHTML = `
        <tr><td colspan="7" class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i><br>Đang tải...
        </td></tr>
    `;

    try {
        const products = await fetchApi(API_PRODUCTS);

        if (products.length === 0) {
            productsTableBody.innerHTML = `
                <tr><td colspan="7" class="empty">Chưa có sản phẩm nào</td></tr>
            `;
            return;
        }

        productsTableBody.innerHTML = products.map(item => `
            <tr>
                <td><strong>#${item.id}</strong></td>
                <td>
                    <img src="${item.image}" class="product-img" alt="${item.name}"
                         onerror="this.src='https://placehold.co/55x55?text=No+Image'">
                </td>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td class="price">${item.price.toLocaleString("vi-VN")}đ</td>
                <td>
                    <span class="stock ${item.quantity < 10 ? 'low' : 'normal'}">
                        ${item.quantity} sp
                    </span>
                </td>
                <td>
                    <div class="actions">
                        <button class="btn-edit" onclick="editProduct('${item.id}')">
                            <i class="fa-solid fa-pen"></i> Sửa
                        </button>
                        <button class="btn-delete" onclick="removeProduct('${item.id}')">
                            <i class="fa-solid fa-trash"></i> Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");

    } catch (error) {
        productsTableBody.innerHTML = `
            <tr><td colspan="7" class="empty" style="color:#e74c3c;">
                 Lỗi tải dữ liệu! Kiểm tra JSON Server.
            </td></tr>
        `;
    }
}

// Load danh mục vào dropdown
async function loadCategoryOptions() {
    try {
        const categories = await fetchApi(API_CATEGORY);
        const select = document.getElementById("productType");

        select.innerHTML = `<option value="">-- Chọn loại --</option>` +
            categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join("");
    } catch (error) {
        console.error("Lỗi load danh mục:", error);
    }
}

// Mở modal thêm sản phẩm
document.getElementById("btnAddProduct").addEventListener("click", () => {
    editingProductId = null;
    document.getElementById("productModalTitle").textContent = "Thêm sản phẩm mới";
    productForm.reset();
    productModal.classList.add("show");
});

// Đóng modal sản phẩm
document.getElementById("closeProductModal").addEventListener("click", () => {
    productModal.classList.remove("show");
});

document.getElementById("cancelProduct").addEventListener("click", () => {
    productModal.classList.remove("show");
});

productModal.addEventListener("click", (e) => {
    if (e.target === productModal) productModal.classList.remove("show");
});

// Sửa sản phẩm
window.editProduct = async (id) => {
    try {
        const product = await getProductById(id);

        editingProductId = id;
        document.getElementById("productModalTitle").textContent = "Sửa sản phẩm";
        document.getElementById("productName").value = product.name;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productQuantity").value = product.quantity;
        document.getElementById("productType").value = product.type;
        document.getElementById("productSize").value = product.size || "M";
        document.getElementById("productColor").value = product.color || "";
        document.getElementById("productImage").value = product.image;

        productModal.classList.add("show");
    }
    catch (error) {
        showToast("Lỗi: " + error.message, true);
    }
};

// Xóa sản phẩm
window.removeProduct = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa sản phẩm này?"))
        return;

    try {
        await deleteProduct(id);
        showToast("Đã xóa sản phẩm!");
        loadProducts();
    }
    catch (error) {
        showToast("Lỗi: " + error.message, true);
    }
};

// Submit form sản phẩm
productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productData = {
        name: document.getElementById("productName").value,
        price: parseInt(document.getElementById("productPrice").value),
        quantity: parseInt(document.getElementById("productQuantity").value),
        type: document.getElementById("productType").value,
        size: document.getElementById("productSize").value,
        color: document.getElementById("productColor").value,
        image: document.getElementById("productImage").value
    };

    try {
        if (editingProductId) {
            await updateProduct(editingProductId, productData);
            showToast("Đã cập nhật sản phẩm!");
        } else {
            await createProduct(productData);
            showToast("Đã thêm sản phẩm mới!");
        }

        productModal.classList.remove("show");
        loadProducts();
    } catch (error) {
        showToast("Lỗi: " + error.message, true);
    }
});



// ==========================================
//          QUẢN LÝ DANH MỤC
// ==========================================

// Load danh sách danh mục
async function loadCategories() {
    categoriesTableBody.innerHTML = `
        <tr><td colspan="4" class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i><br>Đang tải...
        </td></tr>
    `;

    try {
        const categories = await fetchApi(API_CATEGORY);

        if (categories.length === 0) {
            categoriesTableBody.innerHTML = `
                <tr><td colspan="4" class="empty">Chưa có danh mục nào</td></tr>
            `;
            return;
        }

        categoriesTableBody.innerHTML = categories.map(item => `
            <tr>
                <td><strong>#${item.id}</strong></td>
                <td>${item.name}</td>
                <td>${item.description || "-"}</td>
                <td>
                    <div class="actions">
                        <button class="btn-edit" onclick="editCategory('${item.id}')">
                            <i class="fa-solid fa-pen"></i> Sửa
                        </button>
                        <button class="btn-delete" onclick="removeCategory('${item.id}')">
                            <i class="fa-solid fa-trash"></i> Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");

    } catch (error) {
        categoriesTableBody.innerHTML = `
            <tr><td colspan="4" class="empty" style="color:#e74c3c;">
                ❌ Lỗi tải dữ liệu!
            </td></tr>
        `;
    }
}

// Mở modal thêm danh mục
document.getElementById("btnAddCategory").addEventListener("click", () => {
    editingCategoryId = null;
    document.getElementById("categoryModalTitle").textContent = "Thêm danh mục mới";
    categoryForm.reset();
    categoryModal.classList.add("show");
});

// Đóng modal danh mục
document.getElementById("closeCategoryModal").addEventListener("click", () => {
    categoryModal.classList.remove("show");
});

document.getElementById("cancelCategory").addEventListener("click", () => {
    categoryModal.classList.remove("show");
});

categoryModal.addEventListener("click", (e) => {
    if (e.target === categoryModal) categoryModal.classList.remove("show");
});

// Sửa danh mục
window.editCategory = async (id) => {
    try {
        const category = await getCategoryById(id);

        editingCategoryId = id;
        document.getElementById("categoryModalTitle").textContent = "Sửa danh mục";
        document.getElementById("categoryName").value = category.name;
        document.getElementById("categoryDescription").value = category.description || "";

        categoryModal.classList.add("show");
    } catch (error) {
        showToast("Lỗi: " + error.message, true);
    }
};

// Xóa danh mục
window.removeCategory = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa danh mục này?")) return;

    try {
        await deleteCategory(id);
        showToast("Đã xóa danh mục!");
        loadCategories();
        loadCategoryOptions();
    } catch (error) {
        showToast("Lỗi: " + error.message, true);
    }
};

// Submit form danh mục
categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const categoryData = {
        name: document.getElementById("categoryName").value,
        description: document.getElementById("categoryDescription").value
    };

    try {
        if (editingCategoryId) {
            await updateCategory(editingCategoryId, categoryData);
            showToast("Đã cập nhật danh mục!");
        } else {
            await createCategory(categoryData);
            showToast("Đã thêm danh mục mới!");
        }

        categoryModal.classList.remove("show");
        loadCategories();
        loadCategoryOptions();
    } catch (error) {
        showToast("Lỗi: " + error.message, true);
    }
});

// ========== KHỞI CHẠY ==========
loadProducts();
loadCategories();
loadCategoryOptions();