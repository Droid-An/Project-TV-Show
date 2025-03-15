//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  const firstEpisode = allEpisodes[0];

  const template = document.getElementById("film-card");
  const createFilmCard = (firstEpisode) => {
    const card = template.content.cloneNode(true);

    // Now we are querying our cloned fragment, not the entire page.
    const { name, season, number, image, summary } = firstEpisode;
    const title = `${name} - S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`
    card.querySelector("h3").textContent = title;
    card.querySelector("summary").textContent = summary.replace(/<\/?p>/g, "");
    // console.log(image.medium)
    card.querySelector("img").setAttribute("src", image.medium);
    // Return the card, rather than directly appending it to the page
    return card;
  };
  const filmCard = createFilmCard(firstEpisode);

  // Remember we need to append the card to the DOM for it to appear.
  document.body.append(filmCard);
}


function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
