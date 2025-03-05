document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const gameCode = urlParams.get("game");
    const gameTitle = document.getElementById("game-title");
    const productList = document.getElementById("product-list");
    const paymentMethod = document.getElementById("payment-method");
    const userIdInput = document.getElementById("user-id");
    const submitBtn = document.getElementById("submit-btn");

    if (!gameCode) {
        alert("Game tidak terdeteksi!");
        window.location.href = "index.html";
    } else {
        gameTitle.innerText = gameCode.toUpperCase();
        loadProducts(gameCode);
    }

    function loadProducts(game) {
        fetch("https://todagames.id/api/v1/service")
            .then(response => response.json())
            .then(data => {
                const gameData = data.find(item => item.code === game);
                if (!gameData) {
                    alert("Produk tidak ditemukan!");
                    window.location.href = "index.html";
                } else {
                    productList.innerHTML = "";
                    gameData.products.forEach(product => {
                        const option = document.createElement("option");
                        option.value = product.id;
                        option.innerText = `${product.name} - Rp${product.price}`;
                        productList.appendChild(option);
                    });
                }
            })
            .catch(error => console.error("Gagal memuat produk:", error));
    }

    submitBtn.addEventListener("click", function () {
        const userId = userIdInput.value.trim();
        const productId = productList.value;
        const payment = paymentMethod.value;

        if (!userId || !productId || !payment) {
            alert("ID pemain, produk, atau metode pembayaran belum dipilih.");
            return;
        }

        const orderData = {
            memberCode: "TDGdCyOxYvGq",
            apiKey: "HiKiTJTjQZiNhpTUpxVOjOefluYDwq",
            game: gameCode,
            userId: userId,
            productId: productId,
            payment: payment
        };

        fetch("https://todagames.id/api/v1/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Transaksi berhasil! ID Pesanan: " + data.order_id);
                window.location.href = "status.html?order_id=" + data.order_id;
            } else {
                alert("Transaksi gagal: " + data.message);
            }
        })
        .catch(error => console.error("Gagal mengirim transaksi:", error));
    });
});
