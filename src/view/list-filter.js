import AbstractView from '../framework/view/abstract-view.js';

function createListFilterTemplate(userFilters) {
  const {watchlist, watched, favorite} = userFilters;
  return `<nav class="main-navigation">
  <a href="#all" class="main-navigation__item main-navigation__item--active" data-filter-type="all">All movies</a>
  <a href="#watchlist" class="main-navigation__item" data-filter-type="watchlist">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
  <a href="#history" class="main-navigation__item" data-filter-type="watched">History <span class="main-navigation__item-count">${watched}</span></a>
  <a href="#favorites" class="main-navigation__item" data-filter-type="favorite">Favorites <span class="main-navigation__item-count">${favorite}</span></a>
</nav>`;
}

export default class ListFilterView extends AbstractView {
  #userFilters = null;
  #onClick = null;

  currentFilterType = 'all';

  constructor(userFilters, onClick) {
    super();
    this.#userFilters = userFilters;
    this.#onClick = onClick;
    this.element.querySelectorAll('.main-navigation__item').forEach((element) => element.addEventListener('click', this.#onClickFilter));
  }

  get template() {
    return createListFilterTemplate(this.#userFilters);
  }

  #onClickFilter = (evt) => {
    evt.preventDefault();
    this.#onClick(evt.target.dataset.filterType);
    if(this.currentFilterType === evt.target.dataset.filterType) {
      return;
    }
    this.currentFilterType = evt.target.dataset.filterType;
    this.element.querySelectorAll('a')
      .forEach((element) => element.classList.remove('main-navigation__item--active'));
    evt.target.classList.add('main-navigation__item--active');
  };
}
