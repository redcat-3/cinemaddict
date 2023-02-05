import ProfileView from '../view/profile.js';
import {render, replace, remove} from '../framework/render.js';
import { getUserRating } from '../utils.js';

export default class HeaderPresenter {
  #headerContainer = null;
  #filmsModel = null;
  #headerComponent = null;

  constructor({headerContainer, filmsModel}) {
    this.#headerContainer = headerContainer;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const prevHeaderComponent = this.#headerComponent;
    const userRang = getUserRating(this.#filmsModel.films);
    this.#headerComponent = new ProfileView({rang: userRang});

    if (prevHeaderComponent === null) {
      render(this.#headerComponent, this.#headerContainer);
      return;
    }

    render(this.#headerComponent, this.#headerContainer);
    replace(this.#headerComponent, prevHeaderComponent);
    remove(prevHeaderComponent);
  }

  destroy() {
    remove(this.#headerComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
