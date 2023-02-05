import AbstractView from '../framework/view/abstract-view.js';

function createMostCommentedTemplate() {
  return `<section class="films-list films-list--extra">
  <h2 class="films-list__title">Most commented</h2>
  <div class="films-list__container most-commented">
  </div>
  </section>`;
}

export default class MostCommentedView extends AbstractView {
  get template() {
    return createMostCommentedTemplate();
  }
}
