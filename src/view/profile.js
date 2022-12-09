import {createElement} from '../render.js';

function createNewProfileTemplate() {
  return `<section class="header__profile profile">
  <p class="profile__rating"></p>
  <img class="profile__avatar" src="" alt="Avatar" width="35" height="35">
</section>`;
}

export default class NewProfileView {
  getTemplate() {
    return createNewProfileTemplate();
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
