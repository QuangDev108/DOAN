import { fetchApi } from "./fetchApi.js";
import { API_USERS } from "./constant.js";

// ========== ĐĂNG NHẬP ==========
export async function login(username, password) {
    try {
        const users = await fetchApi(API_USERS);
        const user = users.find(u =>
            u.username === username && u.password === password
        );

        if (user) {
            // Đăng nhập thành công thì lưu vào localStorage
            const userData = {
                id: user.id,
                username: user.username,
                role: user.role,
                fullName: user.fullName || user.fullname,
                email: user.email,
                phone: user.phone,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem("currentUser", JSON.stringify(userData));
            console.log("Đăng nhập thành công:", userData);

            return {
                success: true,
                role: user.role,
                user: userData
            };
        } else {
            console.log("Sai tài khoản hoặc mật khẩu!");
            return {
                success: false,
                message: "Sai tài khoản hoặc mật khẩu!"
            };
        }
    } catch (error) {
        console.error("Lỗi kết nối API:", error);
        return {
            success: false,
            message: "Không thể kết nối đến server. Kiểm tra lại JSON SERVER!"
        };
    }
}

// ========== ĐĂNG XUẤT ==========
export function logout() {
    const user = getCurrentUser();
    if (user) {
        console.log(`${user.fullName} đã đăng xuất`);
    }
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// ========== LẤY THÔNG TIN TÀI KHOẢN ĐANG ĐĂNG NHẬP ==========
export function getCurrentUser() {
    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
        try {
            return JSON.parse(userJson);
        } catch (error) {
            console.error("Lỗi parse user data:", error);
            return null;
        }
    }
    return null;
}

// ========== KIỂM TRA ==========
export function isLoggedIn() {
    return getCurrentUser() !== null;
}

export function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === "admin";
}

export function isUser() {
    const user = getCurrentUser();
    return user && user.role === "user";
}

// ========== YÊUCẦU QUYỀN ADMIN ==========
export function requireAdmin() {
    const user = getCurrentUser();

    if (!user) {
        alert("Vui lòng đăng nhập để tiếp tục!");
        window.location.href = "login.html";
        return false;
    }

    if (user.role !== "admin") {
        alert(`Xin lỗi ${user.fullName}!\n\nBạn không có quyền truy cập trang này.\nChỉ Admin mới được vào trang quản trị.`);
        window.location.href = "index.html";
        return false;
    }

    console.log(`Admin ${user.fullName} đã truy cập vào trang QLSP`);
    return true;
}

export function requireLogin() {
    if (!isLoggedIn()) {
        alert("Vui lòng đăng nhập để tiếp tục!");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

// ========== CẬP NHẬT GIAO DIỆN ==========
export function updateHeaderUI() {
    const user = getCurrentUser();
    const loginButton = document.querySelector(".login .button");

    if (!loginButton) return;

    if (user) {
        // ẩn/hiện nút QLSP
        if (user.role === "admin") {
            document.body.classList.add("is-admin");
        } else {
            document.body.classList.remove("is-admin");
        }
        const icon = user.role === 'admin' ? '👨‍💼' : '👤';
        loginButton.innerHTML = `${icon} ${user.fullName}`;
        loginButton.style.cursor = "pointer";

        let dropdown = loginButton.parentElement.querySelector(".user-dropdown");

        if (!dropdown) {
            dropdown = document.createElement("div");
            dropdown.className = "user-dropdown";

            dropdown.innerHTML = `
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
                ">🚪 Đăng xuất</button>
            `;

            loginButton.parentElement.style.position = "relative";
            loginButton.parentElement.appendChild(dropdown);

            // Hover effect tự động nhờ CSS (AI chỉ)
            const btnLogout = dropdown.querySelector("#btnLogoutDropdown");

            loginButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isVisible = dropdown.style.display === "block";
                dropdown.style.display = isVisible ? "none" : "block";
            });

            // Đóng dropdown khi click ra ngoài
            document.addEventListener("click", (e) => {
                if (!loginButton.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.style.display = "none";
                }
            });

            btnLogout.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (confirm(`Bạn có chắc muốn đăng xuất?\n\n${user.fullName}`)) {
                    logout();
                }
            });
        }

    } else {
        // ===== CHƯA ĐĂNG NHẬP =====

        // 1. Ẩn LINK ADMIN
        document.body.classList.remove("is-admin");

        loginButton.innerHTML = "Đăng nhập";
        loginButton.style.cursor = "pointer";

        const dropdown = document.querySelector(".user-dropdown");
        if (dropdown) dropdown.remove();

        loginButton.onclick = (e) => {
            e.preventDefault();
            window.location.href = "login.html";
        };
    }
}