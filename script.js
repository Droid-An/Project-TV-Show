//Create film card
const template = document.getElementById("film-card");
const main = document.querySelector(`#main`);
const header = document.querySelector("#header");
const inputSearch = document.querySelector("input");
const episodesNumber = document.querySelector("#episodesNumber");
const episodesSelect = document.querySelector("#episodes-select");
const allEpisodes = getAllEpisodes();

const createFilmCard = (film) => {
  const card = template.content.cloneNode(true);
  // Now we are querying our cloned fragment, not the entire page.
  const { name, season, number, image, summary } = film;
  const title = `${name} - S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
  card.querySelector("h3").textContent = title;
  card.querySelector("summary").textContent = summary.replace(/<\/?p>|<\/?br>/g, "");
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
  //creating a variable that will contain input value
  let search = "";
  //Rendering episodes
  function render() {
    const filteredEpisodes = allEpisodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(search.toLowerCase()) ||
        episode.summary
          .toLowerCase()
          .replace(/<\/?p>|<\/?br>/g, "")
          .includes(search.toLowerCase())
      );
    });
    createSelectorEpisodes(allEpisodes);

    //Rendering number of filtered episodes
    episodesNumber.textContent = `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;

    const filmCard = filteredEpisodes.map(createFilmCard);
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
      episodesNumber.textContent = `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;
    }
    filteredEpisodes = allEpisodes.filter((episode) => {
      // console.log(episode.id);
      return episode.id === episodeValue;
    });
    const filmCard = filteredEpisodes.map(createFilmCard);
    episodesNumber.textContent = `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;
    main.append(...filmCard);
  });
}
window.onload = setup;
