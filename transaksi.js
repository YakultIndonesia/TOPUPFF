const ORDER_URL = "https://todagames.id/api/v1/order";
const STATUS_URL = "https://todagames.id/api/v1/status";

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
    };

    try {
        const response = await fetch(ORDER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Api-Key": API_KEY,
                "Member-Code": MEMBER_CODE,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (data.status) {
            document.getElementById("order-status").innerText = `Pesanan Berhasil: ${data.data.ref_id}`;
            localStorage.setItem("orderRef", data.data.ref_id);
        } else {
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
            headers: {
                "Content-Type": "application/json",
                "Api-Key": API_KEY,
                "Member-Code": MEMBER_CODE,
            },
            body: JSON.stringify({ ref_id: orderRef }),
        });

        const data = await response.json();
        if (data.status) {
            document.getElementById("order-status").innerText = `Status: ${data.data.status} - ${data.data.note}`;
        } else {
            alert(`Gagal mendapatkan status: ${data.msg}`);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

document.getElementById("order-btn").addEventListener("click", placeOrder);
document.getElementById("check-status-btn").addEventListener("click", checkOrderStatus);
