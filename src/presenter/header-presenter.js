import NewProfileView from '../view/profile.js';
import {render} from '../render.js';

export default class HeaderPresenter {
  headerComponent = new NewProfileView();

  constructor({headerContainer}) {
    this.headerContainer = headerContainer;
  }

  init() {
    render(this.headerComponent, this.headerContainer);
  }
}
