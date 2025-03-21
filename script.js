//Create film card
const template = document.getElementById("film-card");
const main = document.querySelector(`#main`);
const header = document.querySelector("#header");
const inputSearch = document.querySelector("input");
const episodesNumber = document.querySelector("#episodesNumber");

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

function setup() {
  const allEpisodes = getAllEpisodes();
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
}

window.onload = setup;
