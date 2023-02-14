import Observable from '../framework/observable.js';
import { adaptToClient } from '../utils.js';
import { UpdateType } from '../const';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor({commentsApiService}) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  async init(id) {
    try {
      this.#comments = await this.#commentsApiService.loadComments(id);
    } catch(err) {
      this.#comments = [];
    }
    this._notify(UpdateType.INIT, this.#comments);
  }

  async addComment(updateType, { comment, film, scroll }) {
    try {
      const { comments, movie } = await this.#commentsApiService.addComment(comment, film);

      this.#comments = comments;
      const adaptedFilm = adaptToClient(movie);
      const update = {
        film: adaptedFilm,
        scroll: scroll
      };

      const newComments = this.#comments.map(({id}) => id);
      update.film.comments = newComments;

      this._notify(updateType, update);

    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  }

  async deleteComment(updateType, update) {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(update.id);
      this.#comments = this.#comments.filter((comment) => comment.id !== update.id);
      update.film.comments = this.#comments.map(({id}) => id);

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  }
}
