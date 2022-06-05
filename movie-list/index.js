const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = [];

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


function renderMovieList(data) {
  let rawHTML = ''

  data.forEach( (item) => {
    // title，image
    rawHTML += `<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>

          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id=${item.id}>More</button>
            <button class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>

          </div>
        </div>
      </div>
    </div>
  `
  }) 

  dataPanel.innerHTML = rawHTML

}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`; 
  }

  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  // movies ? "movies" : "filteredMovies"
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title")
  const modalImage = document.querySelector("#movie-modal-image")
  const modalDate = document.querySelector("#movie-modal-date")
  const modalDescription = document.querySelector("#movie-modal-description")

  axios.get(INDEX_URL + id).then( response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = "Release Date: " + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []
  const movie = movies.find( movie => movie.id === id )

  if (list.some((movie) => movie.id === id)) {
    return alert('This movie has been added in the favorite!')
  }
  list.push(movie);
  // JSON.stringify(array):將 array 轉換成 JSON string
  // JSON.parse(JSONString): 將 JSON String 轉換成 JS object
  //   const jsonString = JSON.stringify(list)
  //   console.log('json String:', jsonString);
  //   ('json Object:', JSON.parse(jsonString));
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


dataPanel.addEventListener( 'click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal( Number(event.target.dataset.id) )
  } else if (event.target.matches('.btn-add-favorite')) {
      addToFavorite( Number(event.target.dataset.id) );
  } 
  })

paginator.addEventListener( 'click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = event.target.dataset.page
  renderMovieList(getMoviesByPage(page))
})
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  
  if (!keyword.length) {
  alert('Please enter valid strings')
  }
  // map,filter,reduce 陣列操作三寶
  // HW:可以試試每打出一個keyword就跳出搜尋結果
  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))

  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }

  if (filteredMovies.length === 0) {
    return alert('Cannot find any movies with your keyword: ' + keyword)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1));
})  

axios.get(INDEX_URL).then( response => {
  movies.push(...response.data.results)
  renderMovieList(getMoviesByPage(1))
  renderPaginator(movies.length);
})
.catch( error => console.log(error) )

