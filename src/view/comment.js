import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';
import {getCommentDate} from '../utils.js';

function createCommentTemplate(comment) {
  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt=${comment.emotion}>
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(`${comment.comment}`)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${getCommentDate(comment.date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
}

export default class CommentView extends AbstractView {
  #comment = null;

  constructor(comment, onCommentDeleteClick) {
    super();
    this.#comment = comment;

    this.element.querySelector('.film-details__comment-delete').addEventListener('click', onCommentDeleteClick(this.#comment));
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }
}
