// import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpiner();

    // 0) Update serch results and bookmarks to mark active search
    resultsView.update(model.getSearchPageResults());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpiner();

    // 1) Get search query
    const query = searchView.getQuery();

    // 2) Load search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchPageResults());

    // Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render NEW results
  resultsView.render(model.getSearchPageResults(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  // Update the recipe servings (in state)
  model.updateServings(servings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else {
    model.removeBookmark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (data) {
  try {
    // Render spiner
    addRecipeView.renderSpiner();

    // 1) Upload recieved data to server
    await model.uploadRecipe(data);

    // Render success message
    addRecipeView.renderMessage();

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // Render uploaded recipe
    recipeView.render(model.state.recipe);

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err);
  }
};

const newFeature = function() {
  console.log("Welcome to the application");
}


const init = function () {
  bookmarksView.addHandlerBookmark(controlBookmarks);
  recipeView.addHandlerRecipe(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerBtn(controlPagination);
  addRecipeView.addHandlerUpload(controlUploadRecipe);
  console.log('Hello');
};

init();
