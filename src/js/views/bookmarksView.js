import icons from 'url:../../img/icons.svg'; // parcel 2
import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _data;
  _errorMessage = 'No boomarks, find a nice recipe and bookmark it ;)';
  _message = '';

  addHandlerBookmark(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
