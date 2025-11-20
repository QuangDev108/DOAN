export let params = {
    q: "",         
    category: "",     
    sort: "",         
    order: "asc",      
    page: 1,            
    limit: 12,          
};


// Elements
export const inputSearch = document.querySelector("#search input");
export const buttonSearch = document.querySelector("#search button");
export const filter = document.querySelector("#filter");
export const pagiPrev = document.querySelector("#paginationPrev");
export const pagiNext = document.querySelector("#paginationNext");
export const pagiNumber = document.querySelector("#paginationNumber");
export const productsContainer = document.querySelector("#products");
export const categoryContainer = document.querySelector("#category");


export const resetParams = () => {
    params.q = "";
    params.category = "";
    params.sort = "";
    params.order = "asc";
    params.page = 1;
};