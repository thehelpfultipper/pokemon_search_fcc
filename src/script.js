// Find full walkthrough on THT blog
// ** LINK: <WIP>

const apiURL = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";
let input = document.querySelector("#search-input");
const btn = document.querySelector("#search-button");
const options = document.querySelector(".options");
const pkmName = document.querySelector("#pokemon-name"),
  pkmID = document.querySelector("#pokemon-id"),
  pkmW = document.querySelector("#weight"),
  pkmH = document.querySelector("#height"),
  imgWrapper = document.querySelector(".pokemon_img"),
  pkmTypes = document.querySelector("#types");

const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
};

// Get data from API
const fetchPokemonList = async () => {
  const resp = await fetch(apiURL);
  const data = await resp.json();
  return data; // { count:num, resp:[{}]}
};

// Get data for single Pokémon
const fetchSinglePokemon = async (pokemon) => {
  // @pokemon: <name> or id
  const resp = await fetch(`${apiURL}/${pokemon}`);
  const data = await resp.json();

  const {
    name,
    id,
    height,
    weight,
    sprites: { front_default },
    stats,
    types
  } = data;

  return (filteredData = {
    name,
    id,
    height,
    weight,
    img: front_default,
    stats,
    types
  });
};

// Set base stat val based on name
const setBaseStat = (stats) => {
  stats.forEach((obj) => {
    const thisStat = document.querySelector(`#${obj.stat.name}`);
    thisStat.innerText = obj.base_stat;
  });
};

// Get types name(s)
const getTypesNames = (types) => types.map((obj) => obj.type.name);

// Capitalize first letter
const toCap = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Get contrast color
const getContrastColor = (hexColor) => {
  // Convert hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate relative luminance (brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Choose font color based on luminance
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

// Get input matches
const getMatches = (input, pokemonList) => {
  let matches = pokemonList.filter(
    (obj) => obj.name.startsWith(input) || obj.id === Number(input)
  );
  return matches;
};

// Reset everything
const resetAll = () => {
  // console.log('RESET');
  pkmName.innerHTML = "";
  pkmID.innerHTML = "";
  imgWrapper.innerHTML = "";
  pkmW.innerHTML = "";
  pkmH.innerHTML = "";
  pkmTypes.innerHTML = "";
  options.innerHTML = "";
};

// Set input value based on match option
const selectItem = (e) => {
  resetAll();
  // console.log(e.target);
  input.value = toCap(e.target.getAttribute("data-value"));
};

// Display match options
const displayMatches = (matches) => {
  // console.log('MORE THAN ONE MATCH FOUND');
  const divWrap = document.createElement("div");
  const ul = document.createElement("ul");

  const inputVal = input.value.toLowerCase().trim();
  divWrap.classList.add("options_list_wrapper");

  matches.forEach((item) => {
    const li = document.createElement("li");
    li.innerText = `${toCap(item.name)} (#${item.id})`;
    li.setAttribute("data-value", item.name);
    li.id = item.id;
    li.classList.add("options_item");

    li.addEventListener("click", (e) => {
      input.value = toCap(e.target.getAttribute("data-value"));
      options.classList.remove("show");
    });

    ul.appendChild(li);
  });

  divWrap.appendChild(ul);
  options.appendChild(divWrap);
  options.classList.add("show");

  // Handle click out to dismiss options
  document.addEventListener("click", (e) => {
    let elm = e.target;
    let targetElm = document.querySelector(".options");
    let isClickedInside = targetElm.contains(elm);
    if (!isClickedInside && elm !== input) {
      options.classList.remove("show");
    }
  });
};

// Filter matches based on user search
const filterOptions = () => {
  const listItems = document.querySelectorAll(".options_item");
  let filter = input.value.toLowerCase().trim();
  for (let i = 0; i < listItems.length; i++) {
    let txtVal = listItems[i].innerText.toLowerCase();
    if (!txtVal.includes(filter) && filter !== "") {
      listItems[i].classList.add("hide");
    } else {
      listItems[i].classList.remove("hide");
    }
  }

  let hiddenItems = document.querySelectorAll(".options_item:not(.hide)");

  if (hiddenItems.length === 0) {
    options.classList.remove("show");
  } else {
    options.classList.add("show");
  }
};

// Display Pokemon data
const displayData = async (pkm) => {
  const singlePkm = await fetchSinglePokemon(pkm);

  pkmName.innerHTML = `<strong>${toCap(singlePkm.name)}</strong>`;
  pkmID.innerHTML = `#<strong>${singlePkm.id}</strong>`;
  pkmH.innerHTML = `Height: ${singlePkm.height}`;
  pkmW.innerHTML = `Weight: ${singlePkm.weight}`;

  const img = document.createElement("img");
  img.src = singlePkm.img;
  imgWrapper.appendChild(img);

  getTypesNames(singlePkm.types).forEach((type) => {
    pkmTypes.innerHTML += `<span style="background:${
      typeColors[type]
    }; color:${getContrastColor(
      typeColors[type]
    )}">${type.toUpperCase()}</span>`;
  });

  setBaseStat(singlePkm.stats);
};

// Perform search
const handleSearch = (pokemonList) => {
  // Reset elements
  resetAll();
  
  // console.log('Search POKEMON');
  const userInput = input.value.toLowerCase().trim();
  // Get matches
  let matches = getMatches(userInput, pokemonList);
  // console.log('USER INPUT: ' + userInput);
  const exactMatch = matches.some( item => {
    return item.name === userInput;
  });

  if (!matches || matches.length === 0 || !userInput || !exactMatch) {
    alert("No matches found. Try searching again!");
  } else {
    // Set meta
    displayData(userInput);
  }
};

// Search action
(async () => {
  // Fetch actions
  const pokemons = await fetchPokemonList();
  const pokemonList = pokemons.results;
  // console.log(pokemonList.length)

  const showMatchOptions = () => {
    let matches = getMatches(input.value, pokemonList);
    matches.length > 0 && displayMatches(matches);
  }
  
  // User actions
  btn.addEventListener("click", () => handleSearch(pokemonList));
  input.addEventListener("click", showMatchOptions);
  input.addEventListener("keyup", filterOptions);
  input.addEventListener("input", filterOptions);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSearch(pokemonList);
    }
  });
})();

// Add footer dynamic copyright year
document.querySelector('.copy').innerText = new Date().getFullYear();