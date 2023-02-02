import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class CommentsApiService extends ApiService {

  get comments() {
    return this._load({url: 'comments/19'})
      .then(ApiService.parseResponse);
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(ApiService.parseResponse);
  }

  async putComments(filmId, comments) {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.PUT,
      body: JSON.stringify(comments),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }
}
