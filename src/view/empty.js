import {createElement} from '../render.js';

function createEmptyTemplate() {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
}

export default class EmptyView {
  #element = null;

  get template() {
    return createEmptyTemplate();
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
