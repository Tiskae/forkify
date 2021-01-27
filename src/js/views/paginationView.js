import icons from 'url:../../img/icons.svg'; // parcel 2
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _currPage;

  addHandlerBtn(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const target = e.target.closest('.btn--inline');
      if (!target) return;

      const goToPage = +target.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    this._currPage = this._data.page;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1, and there are other pages
    if (this._currPage === 1 && numOfPages > 1)
      return this._generateNextBtnMarkup();

    // Last page
    if (this._currPage === numOfPages && numOfPages > 1)
      return this._generatePrevBtnMarkup();

    // Other page
    if (this._currPage > 1 && this._currPage < numOfPages)
      return `
        ${this._generatePrevBtnMarkup()}
        ${this._generateNextBtnMarkup()}
        `;

    // Page 1, and there are NO other pages
    return '';
  }

  _generateNextBtnMarkup() {
    return `
        <button data-goto ="${
          this._currPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${this._currPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
  }

  _generatePrevBtnMarkup() {
    return `
    <button data-goto ="${
      this._currPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._currPage - 1}</span>
    </button>
        `;
  }
}

export default new PaginationView();
