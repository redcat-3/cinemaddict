import ListFilterView from '../view/list-filter.js';
import SortListView from '../view/sort.js';
import {render} from '../render.js';

export default class controlsPresenter {
  #controlsContainer = null;
  #filFiltersmModel = null;

  constructor({controlsContainer, filFiltersmModel}) {
    this.#controlsContainer = controlsContainer;
    this.#filFiltersmModel = filFiltersmModel;
  }

  init() {
    render(new ListFilterView(this.#filFiltersmModel.userFilters), this.#controlsContainer);
    render(new SortListView(), this.#controlsContainer);
  }
}
