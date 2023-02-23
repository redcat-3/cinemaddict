import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {getCommentDate} from '../utils.js';
import he from 'he';

function createPopupCommentTemplate(comment, state) {
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${he.encode(comment.author)}</span>
          <span class="film-details__comment-day">${getCommentDate(comment.date)}</span>
          <button class="film-details__comment-delete"${state.isDeleting ? ' disabled' : ''}>${state.isDeleting ? 'Deleting ...' : 'Delete'}</button>
        </p>
      </div>
    </li>`
  );
}

export default class PopupCommentView extends AbstractStatefulView {
  #comment = null;
  #handleDeleteClick = null;

  constructor({comment, onDeleteClick}) {
    super();
    this._setState({isDeleting: false});
    this.#comment = comment;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createPopupCommentTemplate(this.#comment, this._state);
  }

  get id() {
    return this.#comment.id;
  }

  get scrollPosition() {
    return this.element.scrollTop;
  }

  _restoreHandlers() {
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#deleteClickHandler);
  }

  scrollPopup(scrollPosition) {
    this.element.scrollTo(0, scrollPosition);
  }

  updateElement(update) {
    const scrollPosition = this.scrollPosition;
    super.updateElement(update);
    this.scrollPopup(scrollPosition);
  }

  #deleteClickHandler = () => {
    this.#handleDeleteClick(this.#comment, this);
  };
}
