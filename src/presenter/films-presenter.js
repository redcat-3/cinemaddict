import {render, RenderPosition} from '../framework/render.js';
import {updateItem, getFilmById, sortByReleaseDate} from '../utils.js';
import FilmPresenter from './film-presenter.js';
import FilmListView from '../view/film-list.js';
import ShowMorePresenter from './show-more-presenter.js';
import EmptyView from '../view/empty.js';
import SortListView from '../view/sort-list.js';
import {SortType} from '../const.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;
  #sortComponent = null;


  #filmListComponent = new FilmListView();
  #emptyListComponent = new EmptyView();

  #listOfFilms = [];
  #sourceListOfFilms = [];
  #showMorePresenter = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
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

    this.#renderSort();
    this.#clearFilmList();
    this.#renderFilms();
  }

  #renderFilm(filmId) {
    const filmPresenter = new FilmPresenter({
      film: getFilmById(this.#listOfFilms, filmId),
      filmContainer: this.#filmListComponent.getFilmListContainer(),
      onControlClick: this.#handleControlClick,
      popupCallBack: this.#setOnePopup,
    });
    const commentsList = this.#filmsModel.rendercommentsById(filmId);
    filmPresenter.init(commentsList);
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

  #renderSort() {
    this.#sortComponent = new SortListView({
      onSortTypeChange: this.#onSortTypeChange
    });

    render(this.#sortComponent, this.#filmContainer, RenderPosition.AFTERBEGIN);
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
    const commentsList = this.#filmsModel.rendercommentsById(update.id);
    this.#filmsPresenter.get(update.id).replace(commentsList);
  };

  #setOnePopup = (callBack) => {
    if(document.querySelector('.film-details')) {
      callBack();
    }
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortFilms(sortType);
  };

  #sortFilms(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this.#listOfFilms.sort((a, b) =>sortByReleaseDate(a, b));
        break;
      case SortType.BY_RATING:
        this.#listOfFilms.sort((a, b) => a.filmInfo.totalRating - b.filmInfo.totalRating);
        break;
      default:
        this.#listOfFilms = [...this.#sourceListOfFilms];
    }

    this.#currentSortType = sortType;
    this.#clearFilmList();
    this.#renderFilms();
  }

  #clearFilmList() {
    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    if (this.#showMorePresenter) {
      this.#showMorePresenter.remove();
    }
  }
}
