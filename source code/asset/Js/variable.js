// Params để quản lý state
export let params = {
    category: "",      // Lọc theo loại sản phẩm
    search: "",        // Tìm kiếm theo tên
    sortBy: "",        // Sắp xếp theo field (price, name, ...)
    order: "asc",      // Thứ tự: asc hoặc desc
    page: 1,           // Trang hiện tại
    limit: 12,         // Số sản phẩm mỗi trang
    priceMin: null,    // Giá tối thiểu
    priceMax: null     // Giá tối đa
};

// Reset về mặc định
export const resetParams = () => {
    params.category = "";
    params.search = "";
    params.sortBy = "";
    params.order = "asc";
    params.page = 1;
    params.priceMin = null;
    params.priceMax = null;
};

// Xây dựng URL với query params
export const buildURL = (baseURL) => {
    const query = [];

    // Filter theo category (dùng type trong database)
    if (params.category && params.category !== "") {
        query.push(`type=${encodeURIComponent(params.category)}`);
    }

    // Search theo tên
    if (params.search && params.search !== "") {
        query.push(`name_like=${encodeURIComponent(params.search)}`);
    }

    // Filter theo giá
    if (params.priceMin !== null && params.priceMin !== undefined) {
        query.push(`price_gte=${params.priceMin}`);
    }
    if (params.priceMax !== null && params.priceMax !== undefined) {
        query.push(`price_lte=${params.priceMax}`);
    }

    // Sort
    if (params.sortBy && params.sortBy !== "") {
        query.push(`_sort=${params.sortBy}`);
        query.push(`_order=${params.order}`);
    }

    // Pagination
    query.push(`_page=${params.page}`);
    query.push(`_limit=${params.limit}`);

    const finalURL = query.length > 0 ? `${baseURL}?${query.join("&")}` : baseURL;
    console.log('buildURL result:', finalURL);
    return finalURL;
};