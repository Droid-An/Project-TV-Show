//Create film card
const template = document.getElementById("film-card");
//Creating and rendering main div
const main = document.createElement("main");
document.body.prepend(main);
//Create header
const header = document.createElement("header");
document.body.prepend(header);
//Creating input
const inputSearch = document.createElement("input");
inputSearch.type = "search";
inputSearch.id = "input";
//Creating h2 for displaying episodes
const episodesNumber = document.createElement("h2");
episodesNumber.id = "episodesNumber";
// episodesNumber.textContent = "Displaying 10/73 episodes";
//Rendering input and h2 elements
header.append(inputSearch, episodesNumber);

const createFilmCard = (film) => {
  const card = template.content.cloneNode(true);
  // Now we are querying our cloned fragment, not the entire page.
  const { name, season, number, image, summary } = film;
  const title = `${name} - S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
  card.querySelector("h3").textContent = title;
  card.querySelector("summary").textContent = summary.replace(/<\/?p>/g, "");
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
          .replace(/<\/?p>/g, "")
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
