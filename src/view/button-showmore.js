import AbstractView from '../framework/view/abstract-view.js';

function createShowMoreTemplate() {
  return '<button class="films-list__show-more">Show more</button>';
}

export default class ShowMoreView extends AbstractView {
  #element = null;

  get template() {
    return createShowMoreTemplate();
  }
}
