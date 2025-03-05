document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const game = urlParams.get("game");

    if (!game) {
        alert("Game tidak ditemukan.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("game-title").innerText = game.replace("-", " ").toUpperCase();

    const produkList = document.getElementById("produk-list");

    try {
        const response = await fetch("https://todagames.id/api/v1/service");
        const data = await response.json();

        const produkGame = data.filter(item => item.game === game);
        produkGame.forEach(produk => {
            let btn = document.createElement("button");
            btn.textContent = `${produk.nama} - Rp${produk.harga}`;
            btn.onclick = () => pilihProduk(produk);
            produkList.appendChild(btn);
        });
    } catch (error) {
        console.error("Gagal mengambil data produk:", error);
    }

    document.getElementById("beli-sekarang").addEventListener("click", lakukanPembelian);
});

function pilihProduk(produk) {
    localStorage.setItem("produk", JSON.stringify(produk));
    alert(`Dipilih: ${produk.nama}`);
}

async function lakukanPembelian() {
    const userId = document.getElementById("user-id").value;
    const metodePembayaran = document.getElementById("metode-pembayaran").value;
    const produk = JSON.parse(localStorage.getItem("produk"));

    if (!userId || !produk) {
        alert("ID pemain atau produk belum dipilih.");
        return;
    }

    const orderData = {
        member_code: "TDGdCyOxYvGq",
        key: "HiKiTJTjQZiNhpTUpxVOjOefluYDwq",
        game: produk.game,
        produk: produk.id,
        user_id: userId,
        payment: metodePembayaran
    };

    try {
        const response = await fetch("https://todagames.id/api/v1/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });
        const result = await response.json();

        if (result.success) {
            alert("Pesanan berhasil! Cek status pembayaran.");
            window.location.href = `status.html?order_id=${result.order_id}`;
        } else {
            alert("Gagal melakukan pembelian.");
        }
    } catch (error) {
        console.error("Gagal memproses transaksi:", error);
    }
}