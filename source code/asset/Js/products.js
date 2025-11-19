import { drawProducts } from "./drawProducts.js";
import { 
    buttonSearch,
    filter,
    priceRange,
    inputSearch,
    pagiNext,
    pagiPrev,
    pagiNumber,
    params,
} from "./variable.js";

console.log('🚀 products.js loaded!');

// Initial draw
drawProducts();

// ===== SEARCH =====
const search = () => {
    params.q = inputSearch.value;
    params.page = 1;
    pagiNumber.innerHTML = params.page;
    drawProducts();
};

if (buttonSearch && inputSearch) {
    buttonSearch.addEventListener("click", search);
    inputSearch.addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });
}

// ===== FILTER (SORT) =====
if (filter) {
    filter.addEventListener("change", (e) => {
        switch(e.target.value) {
            case "mac-dinh":
                params.sort = "";
                params.order = "";
                break;
            case "tu-thap-den-cao":
                params.sort = "price";
                params.order = "asc";
                break;
            case "tu-cao-den-thap":
                params.sort = "price";
                params.order = "desc";
                break;
        }
        params.page = 1;
        pagiNumber.innerHTML = params.page;
        drawProducts();
    });
}

// ===== PAGINATION =====
if (pagiPrev && pagiNext && pagiNumber) {
    pagiPrev.addEventListener("click", () => {
        if (params.page > 1) {
            params.page--;
            pagiNumber.innerHTML = params.page;
            drawProducts();
            document.querySelector("#products-list")?.scrollIntoView({ behavior: "smooth" });
        }
    });

    pagiNext.addEventListener("click", () => {
        params.page++;
        pagiNumber.innerHTML = params.page;
        drawProducts();
        document.querySelector("#products-list")?.scrollIntoView({ behavior: "smooth" });
    });
}