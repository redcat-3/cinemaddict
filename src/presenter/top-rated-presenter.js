import TopRatedView from '../view/top-rated.js';
import FilmPresenter from './film-presenter.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import {UpdateType} from '../const.js';

export default class TopRatedPresenter {
  #filmContainer = null;
  #filmsModel = null;
  #films = null;
  #commentsModel = null;
  #onControlClick = null;
  #popupCallBack = null;
  #popupOpen = null;
  #onCommentUpdate = null;

  #topRatedComponent = new TopRatedView();

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
    render(this.#topRatedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
    this.#renderTopRatedFilms(this.#filmsModel.films);
  }

  update(films) {
    this.#films = [...films];
    remove(this.#topRatedComponent);
    render(this.#topRatedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
    this.#renderTopRatedFilms(this.#films);
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPresenter({
      film,
      commentsModel: this.#commentsModel,
      filmContainer: document.querySelector('.top-rated'),
      onControlClick: this.#onControlClick,
      popupCallBack: this.#popupCallBack,
      popupOpen: this.#popupOpen,
      onCommentUpdate: this.#onCommentUpdate
    });
    filmPresenter.init();
  }

  #renderTopRatedFilms(films) {
    films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    this.#renderFilm(films[0]);
    this.#renderFilm(films[1]);
  }

  #handleFilmsEvent = (updateType, films) => {
    switch (updateType) {
      case UpdateType.PATCH:
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
