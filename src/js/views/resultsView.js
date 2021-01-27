import icons from 'url:../../img/icons.svg'; // parcel 2
import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _data;
  _errorMessage =
    "Couldn't find that recipe for your search query, please try again ;)";
  _message = '';

  _generateMarkup() {
    return this._data.map(res => previewView.render(res, false)).join('');

    // this.render()
  }
}

export default new ResultsView();
