import {createElement} from '../render.js';

function createNewFilmCardTemplate() {
  return ` <article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">Sagebrush Trail</h3>
    <p class="film-card__rating">4.0</p>
    <p class="film-card__info">
      <span class="film-card__year">1937</span>
      <span class="film-card__duration">54m</span>
      <span class="film-card__genre">Western</span>
    </p>
    <img src="./images/posters/sagebrush-trail.jpg" alt="" class="film-card__poster">
    <p class="film-card__description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed vehicula lorem. Quisque eu dignissim sem, vitae sodales dolor. Duis act…</p>
    <span class="film-card__comments">51 comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
  </div>
</article>`;
}

export default class NewFilmCardView {
  getTemplate() {
    return createNewFilmCardTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
