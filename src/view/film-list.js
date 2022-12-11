import {createElement} from '../render.js';

function createNewFilmListTemplate() {
  return `<section class="films">
  <section class="films-list">
  <h2 class="films-list__title">There are no movies in our database</h2>
  <div class="films-list__container">
  </div>
  </section>
  </section>`;
}

export default class NewFilmListView {
  getTemplate() {
    return createNewFilmListTemplate();
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
