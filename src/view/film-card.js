import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {getDuration, getFilmYear} from '../utils.js';

function createFilmCardTemplate(film) {
  const {filmInfo, comments} = film;
  return ` <article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getFilmYear(filmInfo.release.date)}</span>
      <span class="film-card__duration">${getDuration(filmInfo.duration)}</span>
      <span class="film-card__genre">${filmInfo.genre.join(' ')}</span>
    </p>
    <img src=${filmInfo.poster} alt="" class="film-card__poster">
    <p class="film-card__description">${filmInfo.description}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
</article>`;
}

export default class FilmCardView extends AbstractStatefulView {
  #film = null;
  #onClick = null;
  #handleWatchlistClick = null;
  #handleWatchedClick = null;
  #handleFavoriteClick = null;
  _restoreHandlers = null;

  constructor({film, onClick, onWatchlistClick, onWatchedClick, onFavoriteClick}) {
    super();
    this.#film = film;
    this.#onClick = onClick;
    this.#handleWatchlistClick = onWatchlistClick;
    this.#handleWatchedClick = onWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('a')
      .addEventListener('click', this.#clickHandler);
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoritelistClickHandler);
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setUserControls() {
    if(this.#film.userDetails.watchlist) {
      this.element.querySelector('.film-card__controls-item--add-to-watchlist')
        .classList.add('film-card__controls-item--active');
    }
    if(this.#film.userDetails.alreadyWatched) {
      this.element.querySelector('.film-card__controls-item--mark-as-watched')
        .classList.add('film-card__controls-item--active');
    }
    if(this.#film.userDetails.favorite) {
      this.element.querySelector('.film-card__controls-item--favorite')
        .classList.add('film-card__controls-item--active');
    }
  }

  reset() {
    this.updateElement(this.#film);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#onClick(this.#film);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchedClick();
  };

  #favoritelistClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
