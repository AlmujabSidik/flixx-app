const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: "17ed0719c23387b76fedc6c9a015e28e",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};

// Fetch data from TMDB API
async function fetchApiData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showSpinner();
  const response = await fetch(API_URL + endpoint + `?api_key=${API_KEY}`);
  const data = await response.json();
  hideSpinner();
  return data;
}

async function searchApiData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;
  showSpinner();
  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

// Display Popular Movies
async function displayPopularMovies() {
  const popularWrapper = document.getElementById("popular-movies");
  const { results } = await fetchApiData("movie/popular");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    popularWrapper.appendChild(div);
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          ${
            movie.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
              : ``
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
      `;
  });
}

// Display Tv Shows
async function displayTvShows() {
  const popularShows = document.querySelector("#popular-shows");
  const { results } = await fetchApiData("tv/popular");

  results.forEach((tv) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="tv-details.html?id=${tv.id}">
           ${
             tv.poster_path
               ? `<img src="https://image.tmdb.org/t/p/w500${tv.poster_path}" class="card-img-top" alt="${tv.name}" />`
               : ``
           }
        </a>
        <div class="card-body">
          <h5 class="card-title">${tv.name}</h5>
          <p class="card-text">
            <small class="text-muted">Aired: ${tv.first_air_date}</small>
          </p>
        </div>
      `;
    popularShows.appendChild(div);
  });
}

// Display Details Movies
async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];
  const movie = await fetchApiData(`movie/${movieId}`);

  // Overlay for background
  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.querySelector("#movie-details");
  div.innerHTML = `
  <div class="details-top">
          <div>
            ${
              movie.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
                : ``
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
  </div>

          <div class="details-bottom">
          <h2>Movie Info</h2>
        <ul>
          <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
          <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
          <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
          <li><span class="text-secondary">Status:</span> ${movie.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${movie.production_companies.map((company) => ` <span>${company.name}</span> `).join(", ")}</div>
          </div>
       `;
}

async function displayTvShowDetails() {
  const seriesId = window.location.search.split("=")[1];
  const series = await fetchApiData(`tv/${seriesId}`);

  displayBackgroundImage("tv", series.backdrop_path);

  const div = document.querySelector("#show-details");
  div.innerHTML = `<div class="details-top">
          <div>
            ${
              series.poster_path
                ? `<img src="https://image.tmdb.org/t/p/w500${series.poster_path}" class="card-img-top" alt="${series.original_name}" />`
                : ``
            }
          </div>
          <div>
            <h2>${series.original_name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
               ${series.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${series.first_air_date}</p>
            <p>
              ${series.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${series.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${series.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${series.episode_run_time}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${series.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> ${series.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${series.production_companies.map((company) => `<span>${company.name}</span>`).join(", ")}</div>
        </div>`;
}

function addCommasToNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function displayBackgroundImage(type, backgroundPath) {
  const wrapper = document.querySelector(".container");
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backgroundPath})`;
  overlayDiv.classList.add("background-image");

  const container =
    type === "movie"
      ? document.querySelector("#movie-details")
      : document.querySelector("#show-details");

  wrapper.appendChild(overlayDiv);
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

async function displaySlider() {
  const { results } = await fetchApiData("movie/now_playing");
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              ${
                movie.poster_path
                  ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
                  : ``
              }
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
            </h4>
          `;

    swiperWrapper.appendChild(div);
  });
  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

// Search movies/shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchApiData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;
    console.log(global.search.totalResults);
    if (results.length === 0) {
      showAlert("No results found");
      return;
    }
    displaySearchResults(results);
    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter a search term");
  }
}

function displaySearchResults(results) {
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <a href="${global.search.type}-details.html?id=${result.id}">
          ${
            result.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" class="card-img-top" alt="${global.search.type == "movie" ? result.title : result.name}" />`
              : ``
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${global.search.type == "movie" ? result.title : result.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${global.search.type == "movie" ? result.release_date : result.first_air_date}</small>
          </p>
        </div>
      `;

    document.querySelector("#search-results").appendChild(div);
  });
  document.querySelector("#search-results-heading").innerHTML =
    `<h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>`;

  displayPagination();
}

function displayPagination() {
  document.querySelector(".pagination").innerHTML =
    ` <button class="btn btn-primary" id="prev">Prev</button>
        <button class="btn btn-primary" id="next">Next</button>
        <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

  // Disable Prev button if on first page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // Next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;

    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });
  // Prev Page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;

    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });
}

//show alert
function showAlert(msg, className = "alert-error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(msg));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

// Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayTvShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayTvShowDetails();
      break;
    case "/search.html":
      search();
      break;
  }

  highlightActiveLink();
}
document.addEventListener("DOMContentLoaded", init);
