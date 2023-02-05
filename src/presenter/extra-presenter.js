import ExtraView from '../view/extra.js';
import FilmPresenter from './film-presenter.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import {UpdateType} from '../const.js';

export default class ExtraPresenter {
  #filmContainer = null;
  #filmsModel = null;
  #films = null;
  #commentsModel = null;
  #onControlClick = null;
  #popupCallBack = null;
  #popupOpen = null;
  #onCommentUpdate = null;

  #mostCommentedComponent = new ExtraView('Most commented');
  #topRatedComponent = new ExtraView('Top rated');

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
    this.#films = this.#filmsModel.films;
    if(!(this.#filmsModel.films.every((film) => film.comments.length === 0))) {
      render(this.#mostCommentedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
    }
    if(!(this.#filmsModel.films.every((film) => film.filmInfo.totalRating === 0))) {
      render(this.#topRatedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
    }
  }

  update(films) {
    this.#films = [...films];
    remove(this.#mostCommentedComponent);
    remove(this.#topRatedComponent);
    if(!(this.#filmsModel.films.every((film) => film.comments.length === 0))) {
      render(this.#mostCommentedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
      this.#mostCommentedComponent.setMostCommented();
      this.#renderMostCommentedFilms(this.#films);
    }
    if(!(this.#filmsModel.films.every((film) => film.filmInfo.totalRating === 0))) {
      render(this.#topRatedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
      this.#topRatedComponent.setTopRated();
      this.#renderTopRatedFilms(this.#films);
    }
  }

  #renderFilm(film, filmContainer) {
    const filmPresenter = new FilmPresenter({
      film,
      commentsModel: this.#commentsModel,
      filmContainer,
      onControlClick: this.#onControlClick,
      popupCallBack: this.#popupCallBack,
      popupOpen: this.#popupOpen,
      onCommentUpdate: this.#onCommentUpdate
    });
    filmPresenter.init();
  }

  #renderMostCommentedFilms(films) {
    films.sort((a, b) => b.comments.length - a.comments.length);
    this.#renderFilm(films[0], document.querySelector('.most_commented'));
    this.#renderFilm(films[1], document.querySelector('.most_commented'));
  }

  #renderTopRatedFilms(films) {
    films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    this.#renderFilm(films[0], document.querySelector('.top_rated'));
    this.#renderFilm(films[1], document.querySelector('.top_rated'));
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
