import AbstractView from '../framework/view/abstract-view.js';

function createTopRatedTemplate() {
  return `<section class="films-list films-list--extra">
  <h2 class="films-list__title">Top rated</h2>
  <div class="films-list__container top-rated">
  </div>
  </section>`;
}

export default class TopRatedView extends AbstractView {
  get template() {
    return createTopRatedTemplate();
  }
}
