import {createElement} from '../render.js';
import {getDuration} from '../utils.js';

function createFilmCardTemplate(film) {
  //const {title, poster, rating, year, duration, genres, description, comments} = film;

  return ` <article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${film.title}</h3>
    <p class="film-card__rating">${film.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${film.year}</span>
      <span class="film-card__duration">${getDuration(film.duration)}</span>
      <span class="film-card__genre">${film.genres.join(' ')}</span>
    </p>
    <img src=${film.poster} alt="" class="film-card__poster">
    <p class="film-card__description">${film.description}</p>
    <span class="film-card__comments">${film.comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
  </div>
</article>`;
}

export default class FilmCardView {
  #element = null;
  #film = null;
  onClick = null;

  constructor({film, onClick}) {
    this.#film = film;
    this.onClick = function () {
      this.#element.querySelector('.film-card__link').addEventListener('click', onClick);
    };
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
