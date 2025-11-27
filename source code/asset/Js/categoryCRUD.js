import { API_CATEGORY } from "./constant.js";

//======Create - thêm category =====
export const createCategory = async (categoryData) => {
    try
    {
        const response = await fetch(API_CATEGORY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categoryData)
        });

        if(!response.ok)
        {
            throw new Error("Không thể thêm danh mục");
        }

        const result = await response.json();
        console.log("Đã thêm danh mục", result);
        return result;
    }
    catch(error)
    {
        console.error("Lỗi thêm danh mục:",error);
        throw error;
    }
};

//=====Read - Lấy 1 category theo ID =======
export const getCategoryById = async (id) => {
    try
    {
        const response = await fetch(`${API_CATEGORY}/${id}`);

        if(!response.ok)
        {
            throw new Error("Không tìm thấy danh mục");
        }

        const result = await response.json();
        return result; 
    }
    catch(error)
    {
        console.error("Lỗi lấy danh mục:", error);
        throw error;
    }
};

//===Update - Cập nhật danh mục =====
export const updateCategory = async (id, categoryData) => {
    try
    {
        const response = await fetch(`${API_CATEGORY}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categoryData)
        });

        if(!response.ok)
        {
            throw new Error("Không thể update danh mục:");
        }

        const result = await response.json();
        console.log("Đã update danh mục:",result);
        return result;
    }
    catch(error)
    {
        console.error("Lỗi update danh mục:",error);
        throw error;
    }
};

//=====Delete - Xóa danh mục =======
export const deleteCategory = async (id) => {
    try
    {
        const response = await fetch(`${API_CATEGORY}/${id}`, {
            method: "DELETE"
        });

        if(!response.ok)
        {
            throw new Error("Không thể xóa danh mục");
        }

        console.log("Đã xóa danh mục có id:",id);
        return true;
    }
    catch(error)
    {
        console.error ("Lỗi xóa danh mục:", error);
        throw error;
    }
};

//====Patch - Cập nhật 1 phần danh mục =====
export const patchCategory = async (id, partialData) => {
    try
    {
        const response = await fetch (`${API_CATEGORY}/${id}`, {
            method: "PATCH",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(partialData)
        });

        if(!response.ok)
        {
            throw new Error("Không thể cập nhật danh mục");
        }

        const result = await response.json();
        console.log("Đã cập nhật 1 phần danh mục:", result);
        return result;
    }
    catch(error)
    {
        console.error("Lỗi patch danh mục:", error);
        throw error;
    }
};