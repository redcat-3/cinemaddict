import {render} from '../framework/render.js';
import {updateItem} from '../utils.js';
import FilmPresenter from './film-presenter.js';
import FilmListView from '../view/film-list.js';
import ShowMorePresenter from './show-more-presenter.js';
import EmptyView from '../view/empty.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;

  #filmListComponent = new FilmListView();
  #emptyListComponent = new EmptyView();

  #listOfFilms = [];
  #sourceListOfFilms = [];
  #showMorePresenter = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsPresenter = new Map();

  constructor({filmContainer, filmsModel}) {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
  }

  init() {
    this.#listOfFilms = [...this.#filmsModel.films];
    this.#sourceListOfFilms = [...this.#filmsModel.films];

    render(this.#filmListComponent, this.#filmContainer);

    if(this.#listOfFilms.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderFilms();
  }

  #renderFilm(filmId) {
    const filmPresenter = new FilmPresenter({
      film: this.#listOfFilms.find(({ id }) => id === filmId),
      filmContainer: this.#filmListComponent.getFilmListContainer(),
      onControlClick: this.#handleControlClick
    });
    const filmDetails = this.#filmsModel.renderfilmDetailsById(filmId);
    const commentsList = this.#filmsModel.rendercommentsById(filmId);
    filmPresenter.init(filmDetails, commentsList);
    this.#filmsPresenter.set(filmId, filmPresenter);
  }

  #renderShowMoreButton() {
    this.#showMorePresenter = new ShowMorePresenter({
      onClick: this.#onShowMoreClick,
      filmContainer: this.#filmListComponent.getFilmList()
    });
    this.#showMorePresenter.init();
  }

  #renderFilms() {
    for (let i = 0; i < Math.min(this.#listOfFilms.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#listOfFilms[i].id);
    }
    if (this.#listOfFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#filmListComponent.getFilmListContainer());
  }

  #onShowMoreClick = (evt) => {
    evt.preventDefault();
    this.#listOfFilms
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((_, index) => this.#renderFilm(this.#listOfFilms[index + this.#renderedFilmCount].id));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listOfFilms.length) {
      this.#showMorePresenter.remove();
    }
  };

  #handleControlClick = (update) => {
    this.#listOfFilms = updateItem(this.#listOfFilms, update);
    this.#sourceListOfFilms = updateItem(this.#sourceListOfFilms, update);
    const filmDetails = this.#filmsModel.renderfilmDetailsById(update.id);
    const commentsList = this.#filmsModel.rendercommentsById(update.id);
    this.#filmsPresenter.get(update.id).init(filmDetails, commentsList);
  };
}
