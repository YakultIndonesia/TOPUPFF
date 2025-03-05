document.addEventListener("DOMContentLoaded", function () {
    const gameList = document.getElementById("game-list");

    // Fetch daftar game dari API
    fetch("https://todagames.id/api/v1/service")
        .then(response => response.json())
        .then(data => {
            gameList.innerHTML = "";
            data.forEach(game => {
                const gameItem = document.createElement("a");
                gameItem.href = `transaksi.html?game=${game.code}`;
                gameItem.classList.add("game-item");
                gameItem.innerHTML = `
                    <img src="asset/image/${game.code}.png" alt="${game.name}">
                    <span>${game.name}</span>
                `;
                gameList.appendChild(gameItem);
            });
        })
        .catch(error => console.error("Gagal memuat daftar game:", error));
});
