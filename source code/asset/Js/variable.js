export let params = {
    q: "",         
    category: "",     
    sort: "",         
    order: "asc",      
    page: 1,            
    limit: 12,          
};

// CONFIG: Chọn mode filtering
export const FILTER_MODE = "client"; // "client" hoặc "server"

// Elements
export const inputSearch = document.querySelector("#search input");
export const buttonSearch = document.querySelector("#search button");
export const filter = document.querySelector("#filter");
export const pagiPrev = document.querySelector("#paginationPrev");
export const pagiNext = document.querySelector("#paginationNext");
export const pagiNumber = document.querySelector("#paginationNumber");
export const productsContainer = document.querySelector("#products");
export const categoryContainer = document.querySelector("#category");

// HÀM BUILD URL
export const buildURL = (baseURL) => {
    const query = [];

    // Category
    if (params.category && params.category !== "") {
        query.push(`type=${encodeURIComponent(params.category)}`);
    }

    // Search
    if (params.q && params.q !== "") {
        query.push(`name_like=${encodeURIComponent(params.q)}`);
    }

    // Sort
    if (params.sort && params.sort !== "") {
        query.push(`_sort=${params.sort}`);
        query.push(`_order=${params.order}`);
    }

    // Pagination
    query.push(`_page=${params.page}`);
    query.push(`_limit=${params.limit}`);

    const finalURL = query.length > 0 ? `${baseURL}?${query.join("&")}` : baseURL;
    console.log(' Built URL:', finalURL);
    return finalURL;
};

export const resetParams = () => {
    params.q = "";
    params.category = "";
    params.sort = "";
    params.order = "asc";
    params.page = 1;
};