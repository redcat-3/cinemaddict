import AbstractView from '../framework/view/abstract-view';

function createPopupCommentHeaderTemplate(film) {
  return `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.length}</span></h3>`;
}

export default class PopupCommentHeaderView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createPopupCommentHeaderTemplate(this.#film);
  }
}
