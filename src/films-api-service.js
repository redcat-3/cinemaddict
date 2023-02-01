import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then(ApiService.parseResponse);
  }

  async updateFilm(film) {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async putComments(film) {
    const response = await this._load({
      url: `comments/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(film) {
    const adaptedFilm = {...film,
      'film_info': {
        title: film.filmInfo.title,
        'alternative_title': film.filmInfo.alternativeTitle,
        poster: film.filmInfo.poster,
        'total_rating': film.filmInfo.totalRating,
        'age_rating': film.filmInfo.ageRating,
        director: film.filmInfo.director,
        writers: film.filmInfo.writers,
        actors: film.filmInfo.actors,
        release: {
          date: film.filmInfo.date instanceof Date ? film.filmInfo.date.toISOString() : null, // На сервере дата хранится в ISO формате
          'release_country': film.filmInfo.release.releaseCountry},
        duration: film.filmInfo.duration,
        genres: film.filmInfo.genres,
        description: film.filmInfo.description},
      'user_details': {
        watchlist: film.userDetails.watchlist,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate,
        favorite: film.userDetails.favorite}
    };

    // Ненужные ключи мы удаляем
    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;

    return adaptedFilm;
  }
}
