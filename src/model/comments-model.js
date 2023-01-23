import Observable from '../framework/observable.js';
import {createComments} from '../mock/film.js';

export default class CommentsModel extends Observable {
  #comments = null;

  constructor(films) {
    super();
    this.#comments = Array.from(films, (film) => this.#createNewComments(film));
  }

  get comments() {
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }

  #createNewComments (film) {
    const comments = {
      id: film.id,
      commentList: createComments(film.comments)
    };
    return comments;
  }

  updateComments(update) {
    const index = this.#comments.findIndex((commentList) => commentList.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      update,
      ...this.#comments.slice(index + 1),
    ];

    this._notify(update);
  }
}
