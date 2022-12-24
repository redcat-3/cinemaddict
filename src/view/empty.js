import AbstractView from '../framework/view/abstract-view.js';

function createEmptyTemplate() {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
}

export default class EmptyView extends AbstractView {
  #element = null;

  get template() {
    return createEmptyTemplate();
  }
}
