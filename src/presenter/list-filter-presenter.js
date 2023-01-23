import ListFilterView from '../view/list-filter.js';
import {render} from '../render.js';

export default class ListFilterPresenter {
  #listFilterContainer = null;
  #filmFiltersModel = null;
  #listFilterComponent = null;

  #currentFilterType = 'all';

  constructor({listFilterContainer, filmFiltersModel}) {
    this.#listFilterContainer = listFilterContainer;
    this.#filmFiltersModel = filmFiltersModel;
  }

  init() {
    this.#listFilterComponent = new ListFilterView(this.#filmFiltersModel.userFilters, this.#onFilterChange);
    render(this.#listFilterComponent, this.#listFilterContainer);
  }

  #onFilterChange = (filterType) => {
    if(this.#currentFilterType === filterType) {
      return;
    }
    this.#currentFilterType = filterType;
    this.#filmFiltersModel.updateFilter(filterType);
  };
}
