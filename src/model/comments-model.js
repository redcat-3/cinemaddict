import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];
  #filmId = null;

  constructor({commentsApiService}) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    this.#comments = this.#commentsApiService.comments;
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }

  async init(id) {
    try {
      this.#filmId = id;
      this.#comments = await this.#commentsApiService.getComments(id);

    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateComments(id, updateCommentList) {
    this.#filmId = id;
    this.comments = updateCommentList;

    //this._notify(id, updateCommentList);
  }
}
