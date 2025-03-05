const API_KEY = "HiKiTJTjQZiNhpTUpxVOjOefIuYDwq";
const MEMBER_CODE = "TDGdCyOxYvGq";
const SERVICE_URL = "https://todagames.id/api/v1/service";
const VALIDASI_URL = "https://todagames.id/api/v1/validasi";

async function fetchProducts() {
    try {
        const response = await fetch(SERVICE_URL, {
            headers: {
                "Api-Key": API_KEY,
                "Member-Code": MEMBER_CODE,
            },
        });
        const data = await response.json();

        if (data.status) {
            displayProducts(data.data);
        } else {
            console.error("Gagal mengambil produk:", data.msg);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach(product => {
        if (product.status === "On") {
            const productItem = document.createElement("div");
            productItem.className = "product-item";
            productItem.innerHTML = `
                <h3>${product.product}</h3>
                <p>Harga: Rp${parseInt(product.price).toLocaleString()}</p>
                <button onclick="selectProduct('${product.code}', '${product.product}', ${product.price})">
                    Pilih
                </button>
            `;
            container.appendChild(productItem);
        }
    });
}

function selectProduct(code, name, price) {
    localStorage.setItem("selectedProduct", JSON.stringify({ code, name, price }));
    window.location.href = "transaksi.html";
}

async function validateGameID(gameID, gameCode) {
    try {
        const response = await fetch(VALIDASI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Api-Key": API_KEY,
                "Member-Code": MEMBER_CODE,
            },
            body: JSON.stringify({ user_id: gameID, code: gameCode }),
        });

        const data = await response.json();
        if (data.status) {
            document.getElementById("nickname").innerText = `Nickname: ${data.data.nickname}`;
            return true;
        } else {
            alert("ID tidak valid atau tidak ditemukan.");
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});
