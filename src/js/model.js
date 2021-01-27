import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';
// import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    page: 1,
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    // console.log(data);

    let { recipe } = data.data;
    state.recipe = {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      imageUrl: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      title: recipe.title,
      ...(recipe.key && { key: recipe.key }),
    };

    if (state.bookmarks.some(rec => rec.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}/?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imageUrl: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // Set current page back to page 1
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchPageResults = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function (item) {
  localStorage.setItem('bookmarks', JSON.stringify(item));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks(state.bookmarks);
};

export const removeBookmark = function (id) {
  if (!state.bookmarks.some(rec => rec.id === id)) return;

  // Setting the boomarked property to false
  state.recipe.bookmarked = false;

  // Removing the recipe from the bookmarked arr
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  persistBookmarks(state.bookmarks);
};

const init = function () {
  const bookmarks = localStorage.getItem('bookmarks');

  // console.log(bookmarks);
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        console.log(ing);
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Invalid ingredients format, please use the correct format as stated :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const res = await AJAX(`${API_URL}/?key=${KEY}`, recipe);
    const data = res.data.recipe;
    data.bookmarked = true;
    state.bookmarks.push(data);
    persistBookmarks(state.bookmarks);
    state.recipe = data;
  } catch (err) {
    throw err;
  }
};
