const API_KEY = "HiKiTJTjQZiNhpTUpxVOjOefIuYDwq";
const MEMBER_CODE = "TDGdCyOxYvGq";

const ORDER_URL = "https://todagames.id/api/v1/order";
const STATUS_URL = "https://todagames.id/api/v1/status";
const VALIDASI_URL = "https://todagames.id/api/v1/validasi";

async function validateGameID() {
    const userID = document.getElementById("user-id").value;
    if (!userID) {
        alert("Masukkan ID game terlebih dahulu.");
        return;
    }

    try {
        const response = await fetch(VALIDASI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userID,
                api_key: API_KEY,
                member_code: MEMBER_CODE,
            }),
        });

        const data = await response.json();
        if (data.status) {
            document.getElementById("nickname").innerText = `Nickname: ${data.data.nickname}`;
        } else {
            alert(`Validasi Gagal: ${data.msg}`);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function placeOrder() {
    const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
    const userID = document.getElementById("user-id").value;
    const zoneID = document.getElementById("zone-id").value || "1";

    if (!selectedProduct || !userID) {
        alert("Mohon isi ID game dan pilih produk.");
        return;
    }

    const requestBody = {
        user_id: userID,
        zone_id: zoneID,
        code: selectedProduct.code,
        api_key: API_KEY,
        member_code: MEMBER_CODE,
    };

    try {
        const response = await fetch(ORDER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

        if (data.status) {
            const orderDetails = {
                ref_id: data.data.ref_id,
                product: data.data.product,
                user_id: data.data.user_id,
                status: "Processing",
                timestamp: new Date().toLocaleString(),
            };

            orderHistory.push(orderDetails);
            localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

            document.getElementById("order-status").innerText = `Pesanan Berhasil: ${data.data.ref_id}`;
            localStorage.setItem("orderRef", data.data.ref_id);
        } else {
            const failedOrder = {
                ref_id: "FAILED-" + new Date().getTime(),
                product: selectedProduct.name,
                user_id: userID,
                status: `Gagal - ${data.msg}`,
                timestamp: new Date().toLocaleString(),
            };

            orderHistory.push(failedOrder);
            localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

            alert(`Gagal: ${data.msg}`);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function checkOrderStatus() {
    const orderRef = localStorage.getItem("orderRef");
    if (!orderRef) {
        alert("Tidak ada pesanan untuk dicek.");
        return;
    }

    try {
        const response = await fetch(STATUS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ref_id: orderRef,
                api_key: API_KEY,
                member_code: MEMBER_CODE,
            }),
        });

        const data = await response.json();
        const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

        if (data.status) {
            document.getElementById("order-status").innerText = `Status: ${data.data.status} - ${data.data.note}`;

            orderHistory.forEach(order => {
                if (order.ref_id === data.data.ref_id) {
                    order.status = data.data.status;
                }
            });

            localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
        } else {
            alert(`Gagal mendapatkan status: ${data.msg}`);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function loadOrderHistory() {
    const historyContainer = document.getElementById("order-history");
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

    historyContainer.innerHTML = "";
    orderHistory.forEach(order => {
        const orderItem = document.createElement("div");
        orderItem.className = "order-item";
        orderItem.innerHTML = `
            <p><strong>Produk:</strong> ${order.product}</p>
            <p><strong>ID:</strong> ${order.user_id}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Waktu:</strong> ${order.timestamp}</p>
            <hr>
        `;
        historyContainer.appendChild(orderItem);
    });
}

document.getElementById("validate-btn").addEventListener("click", validateGameID);
document.getElementById("order-btn").addEventListener("click", placeOrder);
document.getElementById("check-status-btn").addEventListener("click", checkOrderStatus);
document.addEventListener("DOMContentLoaded", loadOrderHistory);
