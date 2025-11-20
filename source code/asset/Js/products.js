import { drawProducts } from "./drawProducts.js";
import { 
    buttonSearch,
    filter,
    inputSearch,
    pagiNext,
    pagiPrev,
    pagiNumber,
    params,
} from "./variable.js";

console.log('🚀 products.js loaded!');

drawProducts();

function scrollToProducts()
{
    setTimeout(() => {
                const productsSelection = document.querySelector("#products-list");
                if(productsSelection)
                {
                    productsSelection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            },100); 
}

// ===== SEARCH =====
function handleSearch()
{
    params.q = inputSearch.value;
    params.page = 1;
    pagiNumber.innerHTML = params.page;
    drawProducts();
    scrollToProducts();
}

if(buttonSearch)
{
    buttonSearch.addEventListener("click", handleSearch);
}

if(inputSearch)
{
    inputSearch.addEventListener("keydown", (e) => {
        if(e.key === "Enter")
        {
            handleSearch();
        }
    });
}

//=====Sắp xếp =======
if(filter)
{
    filter.addEventListener("change", (e) => {
        const value = e.target.value;

        if(value === "mac-dinh")
        {
            params.sort = "";
            params.order = "";
        }
        else if(value === "tu-thap-den-cao")
        {
            params.sort = "price";
            params.order = "asc";
        }
        else if(value === "tu-cao-den-thap")
        {
            params.sort = "price";
            params.order = "desc";
        }

        params.page = 1;
        pagiNumber.innerHTML = params.page;
        drawProducts();
        scrollToProducts();
    });
}

//=====Pagination =======
if(pagiPrev)
{
    pagiPrev.addEventListener("click", () => {
        if(params.page > 1)
        {
            params.page--;
            pagiNumber.innerHTML = params.page;
            drawProducts();

            const productsList =  document.querySelector("#products-list");
            if(productsList)
            {
                productsList.scrollIntoView({behavior: "smooth"});
            }
        }
    });
}

if(pagiNext)
{
    pagiNext.addEventListener("click", () => {
        params.page++;
        pagiNumber.innerHTML = params.page;
        drawProducts();

        const productsList = document.querySelector("#products-list");
        if(productsList)
        {
            productsList.scrollIntoView({behavior: "smooth"});
        }
    });
}