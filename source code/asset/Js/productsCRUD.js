import { API_PRODUCTS } from "./constant.js";

//====Thêm Sp =====
export const createProduct = async (productData) => {
    try {
        const response = await fetch(API_PRODUCTS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        if(!response.ok)
        {
            throw new console.error("Không thể thêm sp");
            
        }

        const result = await response.json();
        console.log("Đã thêm sp:", result);
        return result;
    }
    catch(error) 
    {
        console.error("Lỗi thêm sp: ", error);
        throw error;
    }
};

//=========Read - Lấy 1 sp theo ID =========
export const getProductById = async (id) => {
    try
    {
        const response = await fetch(`${API_PRODUCTS}/${id}`);

        if(!response.ok)
        {
            throw new Error("Không thể thêm sp");
        }

        const result = await response.json();
        return result;
    }
    catch (error)
    {
        console.error("Không thể lấy sp:", error);
        throw error;
    }
};

//====Update hoặc sửa sp======
export const updateProduct = async (id, productData) => {
    try{
        const response = await fetch(`${API_PRODUCTS}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        if(!response.ok)
        {
            throw new Error("Không thể cập nhật sp");
        }

        const result = await response.json();
        console.log("Đã cập nhật sp", result);
        return result;
    }
    catch(error)
    {
        console.error("Lỗi cập nhật sp", error);
        throw error;
    }
};

//========Delete - xóa SP ========
export const deleteProduct = async (id) => {
    try 
    {
        const response = await fetch(`${API_PRODUCTS}/${id}`, {
            method: "DELETE"
        });

        if(!response.ok)
        {
            throw new Error("Không thể xóa sp");
        }

        console.log("Đã xóa sp id:", id);
        return true;
    }
    catch(error)
    {
        console.error("Lỗi xóa sp:",error);
        throw error;
    }
};

//=====Patch - Cập nhật 1 phần sp ======
export const patchProduct = async (id, partialData) => {
    try 
    {
        const response = await fetch(`${API_PRODUCTS}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(partialData)
        });

        if(!response.ok)
        {
            throw new Error("Không thể patch sp");
        }

        const result = await response.json();
        console.log("Đã patch sp", result);
        return result;
    }
    catch (error)
    {
        console.error("Lỗi patch sp:", error);
        throw error;
    }
};