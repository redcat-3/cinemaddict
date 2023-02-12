import AbstractView from '../framework/view/abstract-view.js';

function createPopupCommentContainerTemplate() {
  return (
    `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
      </section>
    </div>`
  );
}

export default class PopupCommentContainerView extends AbstractView {
  get template() {
    return createPopupCommentContainerTemplate();
  }
}
