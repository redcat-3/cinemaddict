import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createPopupCommentHeaderTemplate(count) {
  return `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${count}</span></h3>`;
}

export default class PopupCommentHeaderView extends AbstractStatefulView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createPopupCommentHeaderTemplate(this.#count);
  }
}
