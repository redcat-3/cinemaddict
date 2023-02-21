import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createPopupFilmControlsTemplate(film) {
  return (
    `<section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist${film.userDetails.watchlist ? ' film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button film-details__control-button--watched${film.userDetails.alreadyWatched ? ' film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite${film.userDetails.favorite ? ' film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
    </section>`
  );
}

export default class PopupFilmcontrolsView extends AbstractStatefulView {
  #film = null;
  #handleWatchlistClick = null;
  #handleAlreadyWatchedClick = null;
  #handleFavoriteClick = null;

  constructor({film, onWatchlistClick, onAlreadyWatchedClick, onFavoriteClick}) {
    super();
    this.#film = film;
    this.#handleWatchlistClick = onWatchlistClick;
    this.#handleAlreadyWatchedClick = onAlreadyWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this._restoreHandlers();
  }

  get template() {
    return createPopupFilmControlsTemplate(this.#film);
  }

  _restoreHandlers() {
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleAlreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
