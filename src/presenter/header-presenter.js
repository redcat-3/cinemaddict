import ProfileView from '../view/profile.js';
import {render} from '../render.js';

export default class HeaderPresenter {
  #headerContainer = null;

  #headerComponent = new ProfileView();

  constructor({headerContainer}) {
    this.#headerContainer = headerContainer;
  }

  init() {
    render(this.#headerComponent, this.#headerContainer);
  }
}
