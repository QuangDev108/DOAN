import { fetchApi } from "./fetchApi";
import { API_USERS } from "./constant";

export async function login(username, password) 
{
  try
  {
    const users = await fetchApi(API_USERS);
    const user = users.find(u =>
        u.username === username && u.password === password);
        if(user) 
        {
            //Đăng nhập thành công thì lưu vào localstorage
            const userData = {
                id: user.id,
                username: user.username,
                role: user.role,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem("currentUser", JSON.stringify(userData));
            console.log("Dang nhap thanh cong:", userData);

            return{
                success: true,
                role: user.role,
                user: user.userData
            };
        }else
        {
            console.log("Sai tk hoac mk!");
            return {
                success: false,
                message: "Sai tk hoac mk!"
            };
        }
  }  catch(error)
    {
        console.error("Loi ket noi API:",error);
        return {
            success: false,
            message: "Khong the ket noi den sv. KTra lai JSON SEVER"
        };
    }
}

//==========Đăng xuất ========
export function logout()
{
    const user = getCurrentUser();
    if(user)
    {
        console.log(`${user.fullname} logout`);
    }
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

//=========Lấy thông tin tk đang đăng nhập ======
export function getCurrentUser()
{
    const userJson = localStorage.getItem("currentUser");
    if(userJson)
    {
        try
        {
            return JSON.parse(userJson);
        }catch(error)
        {
            console.error("Loi parse user data:",error);
            return null;
        }
    }
    return null;
}

//========Kiểm tra ========
export function isLoggedin()
{
    return getCurrentUser() !== null;
}

export function isAdmim()
{
    const user = getCurrentUser();
    return user && user.role === "admin";
}

export function isUser()
{
    const user = getCurrentUser();
    return user && user.role === "user";
}

//======== Admin mới thấy trang QLSP =========
export function requireAdmin()
{
    const user = getCurrentUser();
    if(!user)
    {
        alert("Vui long login");
        window.location.href = "login.html";
        return false;
    }

    if(user.role !== "admin")
    {
        alert(`${user.fullname}! \n\n Bạn không có quyền truy cập trang này!`);
        window.location.href = "index.html";
        return false;
    }

    console.log(`Admin ${user.fullname} đã truy cập vào trang QLSP`);
    return true;
}

export function requireLogin()
{
    if(!isLoggedin())
    {
        alert("Vui lòng đăng nhập để tiếp tục!");
        window.location.href = "login.html";
        return false;
    }
    return true;
}




























//Ch chỉnh


export function updateHeaderUI() {
    const user = getCurrentUser();
    const loginButton = document.querySelector(".login .button");
    
    if (!loginButton) return;

    if (user) {
        // ===== ĐÃ ĐĂNG NHẬP =====
        
        // 1. HIỆN LINK ADMIN NẾU LÀ ADMIN (bằng CSS)
        if (user.role === "admin") {
            document.body.classList.add("is-admin");  // ← ĐƠN GIẢN: Thêm class vào body
        } else {
            document.body.classList.remove("is-admin");
        }
        
        // 2. Hiển thị dropdown
        const icon = user.role === 'admin' ? '👨‍💼' : '👤';
        loginButton.innerHTML = `${icon} ${user.fullName}`;
        loginButton.style.cursor = "pointer";
        
        // Tạo dropdown (giữ nguyên như cũ)
        let dropdown = document.querySelector(".user-dropdown");
        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.className = "user-dropdown";
            dropdown.style.cssText = `
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                padding: 20px;
                min-width: 250px;
                display: none;
                z-index: 9999;
            `;
            
            dropdown.innerHTML = `
                <div style="padding-bottom: 15px; border-bottom: 2px solid #f0f0f0; margin-bottom: 15px;">
                    <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px; color: #333;">
                        ${icon} ${user.fullName}
                    </div>
                    <div style="font-size: 13px; color: #666; background: ${user.role === 'admin' ? '#e3f2fd' : '#f1f8e9'}; 
                                padding: 4px 10px; border-radius: 15px; display: inline-block; margin-top: 5px;">
                        ${user.role === 'admin' ? '⚙️ Quản trị viên' : '👤 Khách hàng'}
                    </div>
                </div>
                <div style="font-size: 13px; color: #666; margin-bottom: 15px; line-height: 1.8;">
                    <div style="margin-bottom: 5px;">📧 ${user.email}</div>
                    <div>📱 ${user.phone}</div>
                </div>
                ${user.role === 'admin' ? 
                    '<a href="admin.html" style="display: block; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; text-align: center; margin-bottom: 10px; font-weight: 500; transition: transform 0.2s;" onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'translateY(0)\'">⚙️ Trang quản trị</a>' 
                    : ''
                }
                <button id="btnLogoutDropdown" style="
                    width: 100%;
                    padding: 12px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#c82333'" onmouseout="this.style.background='#dc3545'">
                    🚪 Đăng xuất
                </button>
            `;
            
            loginButton.parentElement.style.position = "relative";
            loginButton.parentElement.appendChild(dropdown);
            
            // Toggle dropdown
            loginButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
            });
            
            // Đóng dropdown khi click ra ngoài
            document.addEventListener("click", (e) => {
                if (!loginButton.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.style.display = "none";
                }
            });
            
            // Nút đăng xuất
            dropdown.querySelector("#btnLogoutDropdown").addEventListener("click", () => {
                if (confirm(`Bạn có chắc muốn đăng xuất?\n\n👤 ${user.fullName}`)) {
                    logout();
                }
            });
        }
        
    } else {
        // ===== CHƯA ĐĂNG NHẬP =====
        
        // 1. ẨN LINK ADMIN (bằng CSS)
        document.body.classList.remove("is-admin");  // ← ĐƠN GIẢN: Xóa class
        
        // 2. Hiển thị nút đăng nhập
        loginButton.innerHTML = "Đăng nhập";
        loginButton.style.cursor = "pointer";
        
        // Xóa dropdown nếu có
        const dropdown = document.querySelector(".user-dropdown");
        if (dropdown) dropdown.remove();
        
        // Click vào nút đăng nhập
        loginButton.onclick = (e) => {
            e.preventDefault();
            window.location.href = "login.html";
        };
    }
}export function updateHeaderUI() {
    const user = getCurrentUser();
    const loginButton = document.querySelector(".login .button");
    
    if (!loginButton) return;

    if (user) {
        // ===== ĐÃ ĐĂNG NHẬP =====
        
        // 1. HIỆN LINK ADMIN NẾU LÀ ADMIN (bằng CSS)
        if (user.role === "admin") {
            document.body.classList.add("is-admin");  // ← ĐƠN GIẢN: Thêm class vào body
        } else {
            document.body.classList.remove("is-admin");
        }
        
        // 2. Hiển thị dropdown
        const icon = user.role === 'admin' ? '👨‍💼' : '👤';
        loginButton.innerHTML = `${icon} ${user.fullName}`;
        loginButton.style.cursor = "pointer";
        
        // Tạo dropdown (giữ nguyên như cũ)
        let dropdown = document.querySelector(".user-dropdown");
        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.className = "user-dropdown";
            dropdown.style.cssText = `
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                padding: 20px;
                min-width: 250px;
                display: none;
                z-index: 9999;
            `;
            
            dropdown.innerHTML = `
                <div style="padding-bottom: 15px; border-bottom: 2px solid #f0f0f0; margin-bottom: 15px;">
                    <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px; color: #333;">
                        ${icon} ${user.fullName}
                    </div>
                    <div style="font-size: 13px; color: #666; background: ${user.role === 'admin' ? '#e3f2fd' : '#f1f8e9'}; 
                                padding: 4px 10px; border-radius: 15px; display: inline-block; margin-top: 5px;">
                        ${user.role === 'admin' ? '⚙️ Quản trị viên' : '👤 Khách hàng'}
                    </div>
                </div>
                <div style="font-size: 13px; color: #666; margin-bottom: 15px; line-height: 1.8;">
                    <div style="margin-bottom: 5px;">📧 ${user.email}</div>
                    <div>📱 ${user.phone}</div>
                </div>
                ${user.role === 'admin' ? 
                    '<a href="admin.html" style="display: block; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; text-align: center; margin-bottom: 10px; font-weight: 500; transition: transform 0.2s;" onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'translateY(0)\'">⚙️ Trang quản trị</a>' 
                    : ''
                }
                <button id="btnLogoutDropdown" style="
                    width: 100%;
                    padding: 12px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#c82333'" onmouseout="this.style.background='#dc3545'">
                    🚪 Đăng xuất
                </button>
            `;
            
            loginButton.parentElement.style.position = "relative";
            loginButton.parentElement.appendChild(dropdown);
            
            // Toggle dropdown
            loginButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
            });
            
            // Đóng dropdown khi click ra ngoài
            document.addEventListener("click", (e) => {
                if (!loginButton.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.style.display = "none";
                }
            });
            
            // Nút đăng xuất
            dropdown.querySelector("#btnLogoutDropdown").addEventListener("click", () => {
                if (confirm(`Bạn có chắc muốn đăng xuất?\n\n👤 ${user.fullName}`)) {
                    logout();
                }
            });
        }
        
    } else {
        // ===== CHƯA ĐĂNG NHẬP =====
        
        // 1. ẨN LINK ADMIN (bằng CSS)
        document.body.classList.remove("is-admin");  // ← ĐƠN GIẢN: Xóa class
        
        // 2. Hiển thị nút đăng nhập
        loginButton.innerHTML = "Đăng nhập";
        loginButton.style.cursor = "pointer";
        
        // Xóa dropdown nếu có
        const dropdown = document.querySelector(".user-dropdown");
        if (dropdown) dropdown.remove();
        
        // Click vào nút đăng nhập
        loginButton.onclick = (e) => {
            e.preventDefault();
            window.location.href = "login.html";
        };
    }
}