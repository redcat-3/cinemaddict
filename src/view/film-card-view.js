import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import he from 'he';
import { FilterType, TEXT_LIMIT, UpdateType } from '../const.js';
import { getDuration, getFilmYear } from '../utils.js';

function createCardTemplate({film, isDisabled}) {
  const {
    title,
    totalRating,
    release,
    duration,
    genre,
    poster,
    description,
  } = film.filmInfo;

  const {
    watchlist,
    alreadyWatched,
    favorite
  } = film.userDetails;

  const activeWatchlistClassName = watchlist ? 'film-card__controls-item--active' : '';
  const activeAsWatchedClassName = alreadyWatched ? 'film-card__controls-item--active' : '';
  const activeFavoriteClassName = favorite ? ' film-card__controls-item--active' : '';

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${getFilmYear(release.date)}</span>
          <span class="film-card__duration">${getDuration(duration)}</span>
          <span class="film-card__genre">${genre.join(', ')}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">
          ${description.length > TEXT_LIMIT ? `${he.encode(description.slice(0, TEXT_LIMIT))}...` : description}
        </p>
        <span class="film-card__comments">${film.comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button
          class="film-card__controls-item film-card__controls-item--add-to-watchlist ${activeWatchlistClassName}"
          type="button"
          data-control="${FilterType.WATCHLIST}"
          ${isDisabled ? 'disabled' : ''}
          >
        Add to watchlist
        </button>
        <button
          class="film-card__controls-item film-card__controls-item--mark-as-watched ${activeAsWatchedClassName}"
          type="button"
          data-control="${FilterType.HISTORY}"
          ${isDisabled ? 'disabled' : ''}
          >
        Mark as watched
        </button>
        <button
          class="film-card__controls-item film-card__controls-item--favorite ${activeFavoriteClassName}"
          type="button"
          data-control="${FilterType.FAVORITE}"
          ${isDisabled ? 'disabled' : ''}
          >
        Mark as favorite
        </button>
      </div>
    </article>
    `
  );
}

export default class FilmCardView extends AbstractStatefulView {
  #film = null;
  #handleOpenClick = null;
  #handleControlsClick = null;
  #currentFilterType = null;

  constructor({film, isDisabled, onOpenClick, onControlsClick, currentFilterType}) {
    super();
    this._setState ({
      film,
      isDisabled
    });
    this.#handleOpenClick = onOpenClick;
    this.#handleControlsClick = onControlsClick;
    this.#currentFilterType = currentFilterType;
    this._restoreHandlers();
  }

  get template() {
    return createCardTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('.film-card__link')
      .addEventListener('click', this.#handleOpenClick);
    this.element.querySelectorAll('.film-card__controls-item').forEach((element) => {
      element.addEventListener('click', this.#controlsClickHandler);
    });
  }

  updateElement(update) {
    super.updateElement(update);
  }

  #controlsClickHandler = (evt) => {
    evt.preventDefault();

    if (!evt.target.dataset.control) {
      return;
    }

    let updatedDetails = this._state.film.userDetails;
    let updateType;

    switch (evt.target.dataset.control) {
      case FilterType.WATCHLIST: {
        updatedDetails = { ...updatedDetails, watchlist: !this._state.film.userDetails.watchlist };
        updateType = this.#currentFilterType === FilterType.WATCHLIST ? UpdateType.MINOR : UpdateType.PATCH;
        break;
      }
      case FilterType.HISTORY: {
        updatedDetails = { ...updatedDetails, alreadyWatched: !this._state.film.userDetails.alreadyWatched };
        updateType = this.#currentFilterType === FilterType.HISTORY ? UpdateType.MINOR : UpdateType.PATCH;
        break;
      }
      case FilterType.FAVORITE: {
        updatedDetails = { ...updatedDetails, favorite: !this._state.film.userDetails.favorite };
        updateType = this.#currentFilterType === FilterType.FAVORITE ? UpdateType.MINOR : UpdateType.PATCH;
        break;
      }
      default:
        throw new Error('Unknown state!');
    }

    this.#handleControlsClick(updatedDetails, updateType);
  };
}
