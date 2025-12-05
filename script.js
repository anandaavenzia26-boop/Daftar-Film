// ===============================
// DATA MOVIES & FAVORITE FILTER
// ===============================
let movies = JSON.parse(localStorage.getItem("movies") || "[]");
let showFavoriteOnly = false;

// ===============================
// SIMPAN KE LOCAL STORAGE
// ===============================
function saveMovies() {
    localStorage.setItem("movies", JSON.stringify(movies));
}

// ===============================
// STATUS BOX
// ===============================
function statusBox(status) {
    return `
        <span style="
            display:inline-block;
            width:10px;
            height:10px;
            border-radius:3px;
            margin-right:6px;
            background:${status === "Sudah Ditonton" ? "#00ff66" : "#777"};
        "></span>
    `;
}

// ===============================
// WARNA RATING
// ===============================
function ratingColor(r) {
    const n = Number(r);
    if (n >= 8) return "color:#00ff66";
    if (n >= 5) return "color:#ffcc00";
    return "color:#ff4c4c";
}

// ===============================
// CREATE MOVIE CARD
// ===============================
function createMovieCard(movie, index) {
    return `
        <div class="card">

            <div class="love-icon ${movie.favorite ? "active" : ""}" onclick="toggleFavorite(${index})">
                ${movie.favorite ? "♥" : "♡"}
            </div>

            <img class="poster" src="${movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}" />

            <div class="card-body">
                <div class="title">${movie.title}</div>
                <div class="genre">${movie.genre || '-'}</div>

                <div class="status">
                    ${statusBox(movie.status)} ${movie.status}
                </div>

                <div class="rating" style="${ratingColor(movie.rating)}">
                    Rating: ${movie.rating ? movie.rating + "/10" : "-"}
                </div>

                <div class="actions">
                    <button class="edit" onclick="editMovie(${index})">Edit</button>
                    <button class="delete" onclick="deleteMovie(${index})">Hapus</button>
                </div>
            </div>
        </div>
    `;
}

// ===============================
// RENDER MOVIES
// ===============================
function render() {
    const container = document.getElementById("movieList");
    const query = document.getElementById("searchInput").value.toLowerCase();
    container.innerHTML = "";

    // urut rating tertinggi → rendah
    movies.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));

    movies
        .filter(m => m.title.toLowerCase().includes(query))
        .filter(m => !showFavoriteOnly || m.favorite) // filter favorit
        .forEach((movie, i) => {
            container.innerHTML += createMovieCard(movie, i);
        });
}

// ===============================
// TAMBAH MOVIE
// ===============================
function addMovie() {
    const title = document.getElementById("titleInput").value.trim();
    const genre = document.getElementById("genreInput").value;
    const status = document.getElementById("statusInput").value;
    const rating = document.getElementById("ratingInput").value;
    const upload = document.getElementById("posterUpload").files[0];

    if (!title) return alert("Judul tidak boleh kosong.");

    const movieObj = { title, poster: "", genre, status, rating, favorite: false };

    if (upload) {
        const reader = new FileReader();
        reader.onload = function (e) {
            movieObj.poster = e.target.result;
            movies.push(movieObj);
            saveMovies();
            render();
        };
        reader.readAsDataURL(upload);
    } else {
        movies.push(movieObj);
        saveMovies();
        render();
    }

    document.getElementById("titleInput").value = "";
    document.getElementById("posterUpload").value = "";
    document.getElementById("ratingInput").value = "";
}

// ===============================
// DELETE MOVIE
// ===============================
function deleteMovie(index) {
    movies.splice(index, 1);
    saveMovies();
    render();
}

// ===============================
// EDIT MOVIE
// ===============================
function editMovie(index) {
    const m = movies[index];

    const newTitle = prompt("Edit judul:", m.title);
    if (newTitle) m.title = newTitle;

    const newGenre = prompt("Edit genre:", m.genre);
    if (newGenre) m.genre = newGenre;

    const newRating = prompt("Edit rating (1-10):", m.rating);
    if (newRating) m.rating = newRating;

    const newStatus = confirm("Tandai sebagai sudah ditonton?");
    m.status = newStatus ? "Sudah Ditonton" : "Belum Ditonton";

    saveMovies();
    render();
}

// ===============================
// TOGGLE FAVORITE
// ===============================
function toggleFavorite(index) {
    movies[index].favorite = !movies[index].favorite;
    saveMovies();
    render();
}

// ===============================
// FAVORITE FILTER BUTTON
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const searchContainer = document.querySelector(".search-container");

    const favBtn = document.createElement("button");
    favBtn.id = "favFilterBtn";
    favBtn.textContent = "Tampilkan Favorit";
    favBtn.style.padding = "10px 16px";
    favBtn.style.marginTop = "10px";
    favBtn.style.background = "#e50914";
    favBtn.style.color = "white";
    favBtn.style.border = "none";
    favBtn.style.borderRadius = "6px";
    favBtn.style.cursor = "pointer";
    favBtn.onclick = toggleFavoriteFilter;

    searchContainer.appendChild(favBtn);

    render();
});

function toggleFavoriteFilter() {
    showFavoriteOnly = !showFavoriteOnly;

    const btn = document.getElementById("favFilterBtn");
    btn.textContent = showFavoriteOnly ? "Tampilkan Semua" : "Tampilkan Favorit";

    render();
}
