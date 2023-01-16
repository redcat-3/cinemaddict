import ListFilterView from '../view/list-filter.js';
import {render} from '../render.js';

export default class controlsPresenter {
  #controlsContainer = null;
  #filmFiltersmModel = null;

  constructor({controlsContainer, filmFiltersmModel}) {
    this.#controlsContainer = controlsContainer;
    this.#filmFiltersmModel = filmFiltersmModel;
  }

  init() {
    render(new ListFilterView(this.#filmFiltersmModel.userFilters), this.#controlsContainer);
  }

}
