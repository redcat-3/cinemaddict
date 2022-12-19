import ListFilterView from '../view/list-filter.js';
import SortListView from '../view/sort.js';
import {render} from '../render.js';

export default class controlsPresenter {
  #controlsContainer = null;

  constructor({controlsContainer}) {
    this.#controlsContainer = controlsContainer;
  }

  init() {
    render(new ListFilterView(), this.#controlsContainer);
    render(new SortListView(), this.#controlsContainer);
  }
}
