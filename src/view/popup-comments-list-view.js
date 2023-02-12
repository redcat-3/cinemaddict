import AbstractView from '../framework/view/abstract-view.js';

function createPopupCommentListTemplate() {
  return '<ul class="film-details__comments-list"></ul>';
}

export default class PopupCommentListView extends AbstractView {
  get template() {
    return createPopupCommentListTemplate();
  }
}
