//Create film card
const template = document.getElementById("film-card");
const createFilmCard = (film) => {
  const card = template.content.cloneNode(true);
  // Now we are querying our cloned fragment, not the entire page.
  const { name, season, number, image, summary } = film;
  const title = `${name} - S${String(season).padStart(2, "0")}E${String(
    number
  ).padStart(2, "0")}`;
  card.querySelector("h3").textContent = title;
  card.querySelector("summary").textContent = summary.replace(/<\/?p>/g, "");
  // console.log(image.medium)
  card.querySelector("img").setAttribute("src", image.medium);
  // Return the card, rather than directly appending it to the page
  return card;
};

function setup() {
  const allEpisodes = getAllEpisodes();
  const filmCard = allEpisodes.map(createFilmCard);
  // Remember we need to append the card to the DOM for it to appear.
  document.body.append(...filmCard);
}


window.onload = setup;
