import ListFilterView from '../view/list-filter.js';
import SortListView from '../view/sort.js';
import {render} from '../render.js';

export default class controlsPresenter {
  #controlsContainer = null;
  #listFilmModel = null;

  constructor({controlsContainer, listFilmModel}) {
    this.#controlsContainer = controlsContainer;
    this.#listFilmModel = listFilmModel;
  }

  init() {
    render(new ListFilterView(this.#listFilmModel), this.#controlsContainer);
    render(new SortListView(), this.#controlsContainer);
  }
}
