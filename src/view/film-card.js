import AbstractView from '../framework/view/abstract-view.js';
import {getDuration} from '../utils.js';

function createFilmCardTemplate(film) {
  const {title, poster, rating, year, duration, genres, description, comments} = film;
  return ` <article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${getDuration(duration)}</span>
      <span class="film-card__genre">${genres.join(' ')}</span>
    </p>
    <img src=${poster} alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
</article>`;
}

export default class FilmCardView extends AbstractView {
  #film = null;
  #onClick = null;

  constructor({film, onClick}) {
    super();
    this.#film = film;
    this.#onClick = onClick;

    if(this.#film.userDetails.watchlist) {
      this.element.querySelector('.film-card__controls-item--add-to-watchlist').classList.add('film-card__controls-item--active');
    }
    if(this.#film.userDetails.alreadyWatched) {
      this.element.querySelector('.film-card__controls-item--mark-as-watched').classList.add('film-card__controls-item--active');
    }
    if(this.#film.userDetails.favorite) {
      this.element.querySelector('.film-card__controls-item--favorite').classList.add('film-card__controls-item--active');
    }

    this.element.querySelector('.film-card__link')
      .addEventListener('click', this.#onClick);
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }
}
