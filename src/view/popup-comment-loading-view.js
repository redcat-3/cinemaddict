import AbstractView from '../framework/view/abstract-view';

function createPopupCommentLoadingTemplate() {
  return '<h3 class="film-details__comments-title">Loading ...</h3>';
}

export default class PopupCommentLoadingView extends AbstractView {
  get template() {
    return createPopupCommentLoadingTemplate();
  }
}
