import AbstractView from '../framework/view/abstract-view.js';

function createProfileTemplate(rang) {
  return `<section class="header__profile profile">
  <p class="profile__rating">${rang}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
}

export default class ProfileView extends AbstractView {
  #rang = 'loading';

  constructor(rang) {
    super();
    this.#rang = rang;
  }

  get template() {
    return createProfileTemplate(this.#rang);
  }
}
