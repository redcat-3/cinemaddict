import Observable from '../framework/observable.js';
import {UpdateType, UpdateCommentType} from '../const.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];
  #filmId = null;

  constructor({commentsApiService}) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
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
    this._notify(UpdateType.INIT, this.#comments);
  }

  async updateComment(updateType, id, comment) {
    let index = null;
    switch (updateType) {
      case UpdateCommentType.ADD:
        try {
          const response = await this.#commentsApiService.postComment(id, comment);
          this.#comments = [...response.comments];
          this._notify(updateType, id);
        } catch(err) {
          throw new Error('Can\'t update comments');
        }
        break;
      case UpdateCommentType.DELETE:
        index = this.#comments.indexOf(comment);
        if (index === -1) {
          throw new Error('Can\'t update unexisting task');
        }
        try {
          await this.#commentsApiService.deleteComment(comment);
          this.#comments = [
            ...this.#comments.slice(0, index),
            ...this.#comments.slice(index + 1),
          ];
          this._notify(updateType, this.#comments);
        } catch(err) {
          throw new Error('Can\'t update comments');
        }
        break;
    }
  }
}
