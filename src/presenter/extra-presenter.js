import ExtraView from '../view/extra-view.js';
import FilmPresenter from './film-presenter.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import {UpdateType} from '../const.js';

export default class ExtraPresenter {
  #filmContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #currentFilterType = null;
  #commentsModel = null;
  #filmsModel = null;
  #films = null;
  #filmsPresenter = null;

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

  init(filmsPresenter) {
    this.#films = this.#filmsModel.films;
    this.#filmsPresenter = filmsPresenter;
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

  update({ film }) {
    const index = this.#films.findIndex((item) => item.id === film.id);
    if (index === -1) {
      return;
    }
    this.#films = [
      ...this.#films.slice(0, index),
      film,
      ...this.#films.slice(index + 1),
    ];

    remove(this.#mostCommentedComponent);
    remove(this.#topRatedComponent);
    if(!(this.#filmsModel.films.every((item) => item.comments.length === 0))) {
      render(this.#mostCommentedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
    }
    if(!(this.#filmsModel.films.every((item) => item.filmInfo.totalRating === 0))) {
      render(this.#topRatedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
    }
    this.#mostCommentedComponent.setMostCommented();
    this.#renderMostCommentedFilms(this.#films);
    this.#topRatedComponent.setTopRated();
    this.#renderTopRatedFilms(this.#films);
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
    this.#filmsPresenter.set(film.id, filmPresenter);
  }

  #renderMostCommentedFilms(films) {
    films.sort((a, b) => b.comments.length - a.comments.length);
    this.#renderFilm(films[0], this.#mostCommentedComponent.element.querySelector('.most_commented'));
    this.#renderFilm(films[1], this.#mostCommentedComponent.element.querySelector('.most_commented'));
  }

  #renderTopRatedFilms(films) {
    films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    this.#renderFilm(films[0], this.#topRatedComponent.element.querySelector('.top_rated'));
    this.#renderFilm(films[1], this.#topRatedComponent.element.querySelector('.top_rated'));
  }

  #handleFilmsEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
      case UpdateType.MINOR:
        this.update(update);
        break;
      case UpdateType.MAJOR:
      case UpdateType.INIT:
        this.#films = update;
        break;
    }
  };

  #handleCommentsEvent = (updateType, update) => {
    this.update(update);
  };

  destroy() {
    remove(this.#mostCommentedComponent);
    remove(this.#topRatedComponent);
  }
}
