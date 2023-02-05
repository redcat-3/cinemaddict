import FooterStatisticView from '../view/footer-statistic.js';
import {render} from '../framework/render.js';
import {UpdateType} from '../const.js';

export default class FooterPresenter {
  #footerContainer = null;
  #filmsModel = null;
  #countOfFilms = null;

  constructor({footerContainer, filmsModel}) {
    this.#footerContainer = footerContainer;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleFilmsEvent);
  }

  init() {
    this.#countOfFilms = this.#filmsModel.films.length;
  }

  update(films) {
    this.#countOfFilms = films.length;
    render(new FooterStatisticView(this.#countOfFilms), this.#footerContainer);
  }

  #handleFilmsEvent = (updateType, films) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.update(films);
        break;
    }
  };
}
