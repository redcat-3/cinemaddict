import NewListFilterView from '../view/list-filter.js';
import NewSortListView from '../view/sort.js';
import {render} from '../render.js';

export default class controlsPresenter {

  constructor({controlsContainer}) {
    this.controlsContainer = controlsContainer;
  }

  init() {
    render(new NewListFilterView(), this.controlsContainer);
    render(new NewSortListView(), this.controlsContainer);
  }
}
