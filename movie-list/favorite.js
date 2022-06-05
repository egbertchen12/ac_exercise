const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator")

function renderMovieList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    // title，image
    rawHTML += `<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${
            POSTER_URL + item.image
          }" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>

          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id=${
              item.id
            }>More</button>
            <button class="btn btn-danger btn-remove-favorite" data-id=${
              item.id
            }>X</button>

          </div>
        </div>
      </div>
    </div>
  `;
    console.log(item);
  });

  dataPanel.innerHTML = rawHTML;
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release Date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
  });
}

function removeFromFavorite(id) {
  if (!movies || !movies.length) return; //防止 movies 是空陣列的狀況

  //透過 id 找到要刪除電影的 index
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) return;

  //刪除該筆電影
  movies.splice(movieIndex, 1);

  //存回 local storage
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));

  //更新頁面
  renderMovieList(movies);
}

// 當我們在寫function時，如果希望能知道error來自於哪個function,我們就應該要在寫function時給予合適的名字，這樣console.error("error")時就可以清楚知道該error來自於何處
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});

renderMovieList(movies)

