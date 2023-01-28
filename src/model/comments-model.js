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
    const comment = {
      id: film.id,
      commentList: createComments(film.comments)
    };
    return comment;
  }

  updateComments(id, updateCommentList) {
    const index = this.comments.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }

    const comment = {
      id,
      commentList: updateCommentList
    };

    this.comments = [
      ...this.#comments.slice(0, index),
      comment,
      ...this.#comments.slice(index + 1),
    ];

    //this._notify(id, updateCommentList);
  }
}
