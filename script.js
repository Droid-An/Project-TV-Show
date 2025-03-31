//Create film card
const template = document.getElementById("film-card");
const main = document.querySelector(`#main`);
const header = document.querySelector("#header");
const inputSearch = document.querySelector("input");
const episodesNumber = document.querySelector("#episodesNumber");
const episodesSelect = document.querySelector("#episodes-select");
const errorMessage = document.querySelector("#errorMessage");
const loadingMessage = document.querySelector("#loadingMessage");

// Define state
const state = {
  films: [],
};

const endpoint = "https://api.tvmaze.com/shows";

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

function setup() {
  // fetching data
  const fetchFilms = async () => {
    try {
      errorMessage.style.display = `none`;
      loadingMessage.textContent = "loading";
      const response = await fetch(endpoint);
      return await response.json();
    } catch (error) {
      errorMessage.style.display = `contents`;
      errorMessage.textContent = error;
    }
  };

  fetchFilms().then((films) => {
    // When the fetchFilms Promise resolves, this callback will be called.
    state.films = films;
    loadingMessage.style.display = `none`;
    render();
  });

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
    createSelectorEpisodes(state.films);

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
      episodesNumber.textContent = `Displaying ${filteredEpisodes.length}/${state.films.length} episodes`;
    }
    // could be replaced with find() to speed up search
    filteredEpisodes = state.films.find((episode) => episode.id == episodeValue);

    // no necessity in map as you only need to render one episode
    const filmCard = createFilmCard(filteredEpisodes);
    episodesNumber.textContent = `Displaying ${filteredEpisodes.length}/${state.films.length} episodes`;
    main.append(filmCard);
  });
}
window.onload = setup;
