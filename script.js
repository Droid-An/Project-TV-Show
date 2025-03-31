"use strict";

//Create film card
const template = document.getElementById("film-card");
const main = document.querySelector(`#main`);
const header = document.querySelector("#header");
const inputSearch = document.querySelector("input");
const episodesNumber = document.querySelector("#episodesNumber");
const episodesSelect = document.querySelector("#episodes-select");
const errorMessage = document.querySelector("#errorMessage");
const loadingMessage = document.querySelector("#loadingMessage");
const showsSelect = document.querySelector("#show-select");

// Define state
const state = {
  shows: [],
  films: [],
};

const createFilmCard = (film) => {
  const card = template.content.cloneNode(true);
  // Now we are querying our cloned fragment, not the entire page.
  const { name, season, number, image, summary } = film;
  const title = `${name} - S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
  card.querySelector("h3").textContent = title;
  card.querySelector("summary").textContent = summary.replace(/<\/?p>|<\/?br>|<\/?b>|<\/?i>|<br \/> /g, "");
  // console.log(image.medium)
  card.querySelector("img").setAttribute("src", image.medium);
  // Return the card, rather than directly appending it to the page
  return card;
};

function createSelectorEpisodes(episodes) {
  episodes.forEach((episode, index) => {
    const option = document.createElement(`option`);
    option.classList.add(`options`);
    option.value = episode.id;
    option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
    episodesSelect.appendChild(option);
  });
}
function createSelectorShows(shows) {
  shows.forEach((show, index) => {
    const option = document.createElement(`option`);
    option.classList.add(`options`);
    option.value = show.id;
    option.textContent = show.name;
    showsSelect.appendChild(option);
  });
}

function setup() {
  // fetching data

  const fetchShows = async () => {
    try {
      errorMessage.style.display = `none`;
      loadingMessage.textContent = "loading";
      const response = await fetch(`https://api.tvmaze.com/shows`);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      errorMessage.style.display = `contents`;
      errorMessage.textContent = error;
    }
  };

  fetchShows().then((shows) => {
    // When the fetchShows Promise resolves, this callback will be called.
    state.shows = shows.sort((a, b) => a.name.localeCompare(b.name));
    loadingMessage.style.display = `none`;
    render();
  });

  const fetchEpisodes = async (episodeId) => {
    try {
      errorMessage.style.display = `none`;
      loadingMessage.textContent = "loading";
      const response = await fetch(`https://api.tvmaze.com/shows/${episodeId}/episodes`);
      const data = await response.json();
      return data;
    } catch (error) {
      errorMessage.style.display = `contents`;
      errorMessage.textContent = error;
    }
  };
  //creating a variable that will contain input value
  let search = "";
  //Rendering episodes
  function render() {
    const filteredEpisodes = state.films.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(search.toLowerCase()) ||
        episode.summary
          .toLowerCase()
          .replace(/<\/?p>|<\/?br>|<\/?b>|<\/?i>|<br \/>/g, "")
          .includes(search.toLowerCase())
      );
    });
    createSelectorShows(state.shows);

    //Rendering number of filtered episodes
    episodesNumber.textContent = `Displaying ${filteredEpisodes.length}/${state.films.length} episodes`;

    const filmCard = filteredEpisodes.map(createFilmCard);
    main.innerHTML = "";
    // Remember we need to append the card to the DOM for it to appear.
    main.append(...filmCard);
  }
  render();
  // Implementing live search filtering
  inputSearch.addEventListener("keyup", () => {
    search = inputSearch.value;
    main.innerHTML = "";
    render();
  });

  episodesSelect.addEventListener("change", () => {
    main.innerHTML = "";
    const episodeValue = +episodesSelect.value;
    if (episodeValue === 1111) {
      render();
    }
    // could be replaced with find() to speed up search

    const filteredEpisode = state.films.find((episode) => episode.id == episodeValue);
    if (!filteredEpisode) {
      return;
    }
    // no necessity in map as you only need to render one episode
    const filmCard = createFilmCard(filteredEpisode);
    episodesNumber.textContent = `Displaying ${1}/${state.films.length} episodes`;
    main.append(filmCard);
  });
  showsSelect.addEventListener(`change`, () => {
    episodesSelect.innerHTML = "<option value=1111>All episodes</option>";
    main.innerHTML = "";
    const showValue = +showsSelect.value;
    fetchEpisodes(showValue).then((episode) => {
      state.films = episode.sort((a, b) => a.name.localeCompare(b.name));
      render();

      createSelectorEpisodes(state.films);
    });
  });
}

window.onload = setup;
