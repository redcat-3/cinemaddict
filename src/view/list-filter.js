import AbstractView from '../framework/view/abstract-view.js';

function createListFilterTemplate(userFilters) {
  const {watchlist, watched, favorite} = userFilters;
  return `<nav class="main-navigation">
  <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
  <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
  <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${watched}</span></a>
  <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorite}</span></a>
</nav>`;
}

export default class ListFilterView extends AbstractView {
  #userFilters = null;

  constructor(userFilters) {
    super();
    this.#userFilters = userFilters;
  }

  get template() {
    return createListFilterTemplate(this.#userFilters);
  }
}
