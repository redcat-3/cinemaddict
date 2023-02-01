import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class CommentsModel extends Observable {
  #filmsApiService = null;
  #comments = [];

  constructor({filmsApiService}) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get comments() {
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }

  async init(id) {
    try {
      const comments = await this.#filmsApiService.getComments(id);
      this.#comments = comments.value;
      console.log(this.#comments);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT);
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
