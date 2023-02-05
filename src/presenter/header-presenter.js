import ProfileView from '../view/profile.js';
import {render, remove} from '../framework/render.js';
import {UpdateType} from '../const.js';

export default class HeaderPresenter {
  #headerContainer = null;
  #filmFiltersModel = null;
  #rang = null;
  #headerComponent = null;

  constructor({headerContainer, filmFiltersModel}) {
    this.#headerContainer = headerContainer;
    this.#filmFiltersModel = filmFiltersModel;

    this.#filmFiltersModel.addObserver(this.#handleFilterChange);
  }

  init() {
    this.#headerComponent = new ProfileView(this.#rang);
    render(this.#headerComponent, this.#headerContainer);
  }

  update(filters) {
    this.#rang = filters.watched;
    remove(this.#headerComponent);
    this.#headerComponent = new ProfileView(this.#rang);
    render(this.#headerComponent, this.#headerContainer);
  }

  #handleFilterChange = (updateType, filters) => {
    switch (updateType) {
      case UpdateType.PATCH:
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
      case UpdateType.INIT:
        this.update(filters);
        break;
    }
  };
}
