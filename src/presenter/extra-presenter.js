import ExtraView from '../view/extra.js';
import FilmPresenter from './film-presenter.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import {UpdateType} from '../const.js';

export default class ExtraPresenter {
  #filmContainer = null;

  #filmComponent = null;
  #filmPopup = null;

  #film = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #currentFilterType = null;
  #commentsModel = null;
  #filmsModel = null;
  #films = null;

  #mostCommentedComponent = new ExtraView('Most commented');
  #topRatedComponent = new ExtraView('Top rated');

  constructor({filmExtraContainer, onDataChange, onModeChange, currentFilterType, commentsModel, filmsModel}) {
    this.#filmContainer = filmExtraContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#currentFilterType = currentFilterType;
    this.#commentsModel = commentsModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleFilmsEvent);
    this.#commentsModel.addObserver(this.#handleCommentsEvent);
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
      filmContainer,
      onDataChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange,
      currentFilterType: this.#currentFilterType,
      commentsModel: this.#commentsModel
    });
    filmPresenter.init(film);
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
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
      case UpdateType.INIT:
        this.update(films);
        break;
    }
  };

  #handleCommentsEvent = () => {
    this.update(this.#filmsModel.films);
  };
}
