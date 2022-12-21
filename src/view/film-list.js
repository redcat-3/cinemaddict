import {createElement} from '../render.js';

function createFilmListTemplate() {
  return `<section class="films">
  <section class="films-list">
  <div class="films-list__container">
  </div>
  </section>
  </section>`;
}

export default class FilmListView {
  #element = null;

  get template() {
    return createFilmListTemplate();
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
