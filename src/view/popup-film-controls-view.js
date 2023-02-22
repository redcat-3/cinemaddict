import { FilterType, UpdateType } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createPopupFilmControlsTemplate(state) {
  return (
    `<section class="film-details__controls"${state.isDisabled ? ' disabled' : ''}>
      <button type="button" class="film-details__control-button film-details__control-button--watchlist${state.film.userDetails.watchlist ? ' film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button film-details__control-button--watched${state.film.userDetails.alreadyWatched ? ' film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite${state.film.userDetails.favorite ? ' film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
    </section>`
  );
}

export default class PopupFilmcontrolsView extends AbstractStatefulView {
  #currentFilterType = null;
  #handleControlsClick = null;
  updatedDetails = null;
  updateType = FilterType.ALL;

  constructor({film, isDisabled, onControlsClick, currentFilterType}) {
    super();
    this.#handleControlsClick = onControlsClick;
    this.#currentFilterType = currentFilterType;
    this._setState ({
      film,
      isDisabled,
    });
    this._restoreHandlers();
    this.updatedDetails = this._state.film.userDetails;
  }

  get template() {
    return createPopupFilmControlsTemplate(this._state);
  }

  get scrollPosition() {
    return this.element.scrollTop;
  }

  _restoreHandlers() {
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  scrollPopup(scrollPosition) {
    this.element.scrollTo(0, scrollPosition);
  }

  updateElement(update) {
    const scrollPosition = this.scrollPosition;
    super.updateElement(update);
    this.scrollPopup(scrollPosition);
    this._restoreHandlers();
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.updatedDetails = { ...this.updatedDetails, watchlist: !this._state.film.userDetails.watchlist };
    this.updateType = this.#currentFilterType === FilterType.WATCHLIST ? UpdateType.MINOR : UpdateType.PATCH;
    this.#handleControlsClick(this.updatedDetails, this.updateType);
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this.updatedDetails = { ...this.updatedDetails, alreadyWatched: !this._state.film.userDetails.alreadyWatched };
    this.updateType = this.#currentFilterType === FilterType.HISTORY ? UpdateType.MINOR : UpdateType.PATCH;
    this.#handleControlsClick(this.updatedDetails, this.updateType);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.updatedDetails = { ...this.updatedDetails, favorite: !this._state.film.userDetails.favorite };
    this.updateType = this.#currentFilterType === FilterType.FAVORITE ? UpdateType.MINOR : UpdateType.PATCH;
    this.#handleControlsClick(this.updatedDetails, this.updateType);
  };
}
