import {createElement} from '../render.js';

function createNewShowMoreTemplate() {
  return '<button class="films-list__show-more">Show more</button>';
}

export default class NewShowMoreView {
  getTemplate() {
    return createNewShowMoreTemplate();
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
