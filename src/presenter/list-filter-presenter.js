import ListFilterView from '../view/list-filter.js';
import {render, replace, remove} from '../framework/render.js';

export default class ListFilterPresenter {
  #listFilterContainer = null;
  #filmFiltersModel = null;
  #listFilterComponent = null;

  #currentFilterType = 'all';

  constructor({listFilterContainer, filmFiltersModel}) {
    this.#listFilterContainer = listFilterContainer;
    this.#filmFiltersModel = filmFiltersModel;

    this.#filmFiltersModel.addObserver(this.#handleModelUpdate);
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

  #handleModelUpdate = (userFilters) => {
    this.update(userFilters);
  };

  update(userFilters) {
    const updateComponent = new ListFilterView(userFilters, this.#onFilterChange);
    replace(updateComponent, this.#listFilterComponent);
    this.#listFilterComponent = updateComponent;
  }

  remove() {
    remove(this.#listFilterComponent);
  }
}
