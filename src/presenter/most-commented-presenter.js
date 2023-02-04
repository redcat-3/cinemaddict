import MostCommentedView from '../view/most-commented.js';
import FilmPresenter from './film-presenter.js';
import {render, RenderPosition} from '../render.js';
import {UpdateType} from '../const.js';

export default class MostCommentedPresenter {
  #filmContainer = null;
  #filmsModel = null;
  #films = null;
  #commentsModel = null;
  #onControlClick = null;
  #popupCallBack = null;
  #popupOpen = null;
  #onCommentUpdate = null;

  #mostCommentedComponent = new MostCommentedView();

  constructor({filmContainer, filmsModel, commentsModel, onControlClick, popupCallBack, popupOpen, onCommentUpdate}) {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#onControlClick = onControlClick;
    this.#popupCallBack = popupCallBack;
    this.#popupOpen = popupOpen;
    this.#onCommentUpdate = onCommentUpdate;

    this.#filmsModel.addObserver(this.#handleFilmsEvent);
  }

  init() {
    render(this.#mostCommentedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
  }

  update(films) {
    this.#films = [...films];
    this.#renderMostCommentedFilms(this.#films);
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPresenter({
      film,
      commentsModel: this.#commentsModel,
      filmContainer: document.querySelector('.most-commented'),
      onControlClick: this.#onControlClick,
      popupCallBack: this.#popupCallBack,
      popupOpen: this.#popupOpen,
      onCommentUpdate: this.#onCommentUpdate
    });
    filmPresenter.init();
  }

  #renderMostCommentedFilms(films) {
    films.sort((a, b) => b.comments.length - a.comments.length);
    this.#renderFilm(films[0]);
    this.#renderFilm(films[1]);
  }

  #handleFilmsEvent = (updateType, films) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.update(films);
        break;
      case UpdateType.MINOR:
        this.update(films);
        break;
      case UpdateType.MAJOR:
        this.update(films);
        break;
      case UpdateType.INIT:
        this.update(films);
        break;
    }
  };
}
