import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class CommentsApiService extends ApiService {
  #filmId = null;

  constructor(filmId) {
    super();
    this.#filmId = filmId;
  }

  get comments() {
    return this._load({url: `comments/${this.#filmId}`})
      .then(ApiService.parseResponse);
  }

  async putComments(comments) {
    const response = await this._load({
      url: `comments/${this.#filmId}`,
      method: Method.PUT,
      body: JSON.stringify(comments),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }
}
