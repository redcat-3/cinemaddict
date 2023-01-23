import {render, RenderPosition, remove} from '../framework/render.js';
import {getItemById, sortByReleaseDate} from '../utils.js';
import FilmPresenter from './film-presenter.js';
import FilmListView from '../view/film-list.js';
import ShowMorePresenter from './show-more-presenter.js';
import EmptyView from '../view/empty.js';
import SortListView from '../view/sort-list.js';
import {SortType, UpdateType} from '../const.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #sortComponent = null;
  #filmFiltersModel = null;


  #filmListComponent = new FilmListView();
  #emptyListComponent = new EmptyView();

  #showMorePresenter = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filmsPresenter = new Map();

  constructor({filmContainer, filmsModel, commentsModel, filmFiltersModel}) {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filmFiltersModel = filmFiltersModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filmFiltersModel.addObserver(this.#handleFilterChange);
  }

  get films() {
    switch (this.#filmFiltersModel.currentFilterType) {
      case 'watched':
        switch (this.#currentSortType) {
          case SortType.BY_DATE:
            return this.#filmFiltersModel.watched.sort((a, b) =>sortByReleaseDate(a, b));
          case SortType.BY_RATING:
            return this.#filmFiltersModel.watched.sort((a, b) => a.filmInfo.totalRating - b.filmInfo.totalRating);
          case SortType.DEFAULT:
          default:
            return this.#filmFiltersModel.watched;
        }
      case 'favorite':
        switch (this.#currentSortType) {
          case SortType.BY_DATE:
            return this.#filmFiltersModel.favorite.sort((a, b) =>sortByReleaseDate(a, b));
          case SortType.BY_RATING:
            return this.#filmFiltersModel.favorite.sort((a, b) => a.filmInfo.totalRating - b.filmInfo.totalRating);
          case SortType.DEFAULT:
          default:
            return this.#filmFiltersModel.favorite;
        }
      case 'watchlist':
        switch (this.#currentSortType) {
          case SortType.BY_DATE:
            return this.#filmFiltersModel.watchlist.sort((a, b) =>sortByReleaseDate(a, b));
          case SortType.BY_RATING:
            return this.#filmFiltersModel.watchlist.sort((a, b) => a.filmInfo.totalRating - b.filmInfo.totalRating);
          case SortType.DEFAULT:
          default:
            return this.#filmFiltersModel.watchlist;
        }
      case 'all':
      default:
        switch (this.#currentSortType) {
          case SortType.BY_DATE:
            return this.#filmFiltersModel.all.sort((a, b) =>sortByReleaseDate(a, b));
          case SortType.BY_RATING:
            return this.#filmFiltersModel.all.sort((a, b) => a.filmInfo.totalRating - b.filmInfo.totalRating);
          case SortType.DEFAULT:
          default:
            return this.#filmFiltersModel.all;
        }
    }
  }

  init() {
    this.#renderSort();
    this.#renderFilmList();
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPresenter({
      film: getItemById(this.films, film.id),
      filmContainer: this.#filmListComponent.getFilmListContainer(),
      onControlClick: this.#handleControlClick,
      popupCallBack: this.#setOnePopup,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    const commentList = getItemById(this.#commentsModel.comments, film.id);
    filmPresenter.init(commentList.commentList);
    this.#filmsPresenter.set(film.id, filmPresenter);
  }

  #renderShowMoreButton() {
    this.#showMorePresenter = new ShowMorePresenter({
      onClick: this.#onShowMoreClick,
      filmContainer: this.#filmListComponent.getFilmList()
    });
    this.#showMorePresenter.init();
  }

  #renderFilms(films) {
    films.forEach((film) => this.#renderFilm(film));
  }

  #renderFilmList() {
    render(this.#filmListComponent, this.#filmContainer);
    const films = this.films;
    const filmCount = films.length;
    if(filmCount === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));
    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
  }

  #renderSort() {
    if(!this.#sortComponent) {
      this.#sortComponent = new SortListView({
        onSortTypeChange: this.#onSortTypeChange
      });
      render(this.#sortComponent, this.#filmContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#filmListComponent.getFilmListContainer());
  }

  #handleModeChange = () => {
    this.#filmsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleFilterChange = () => {
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    this.#sortComponent.reset();
    this.#currentSortType = SortType.DEFAULT;
    this.#clearFilmList();
    this.#renderFilmList();
  };

  #handleViewAction = (updateType, update) => {
    this.#filmsModel.updateFilm(updateType, update);
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmsPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFilmList();
        this.#renderFilmList();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmList();
        break;
    }
  };

  #onShowMoreClick = (evt) => {
    evt.preventDefault();
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      this.#showMorePresenter.remove();
    }
  };

  #handleControlClick = (update) => {
    // обновление модели
    const commentList = getItemById(this.#commentsModel.comments, update.id);
    this.#filmsPresenter.get(update.id).replace(commentList.commentList);
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
    this.#currentSortType = sortType;
    this.#clearFilmList({resetRenderedFilmCount: true});
    this.#renderSort();
    this.#renderFilmList();
  };

  #clearFilmList({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this.films.length;
    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();

    remove(this.#emptyListComponent);
    this.#showMorePresenter.remove();


    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }
}
