import Observable from '../framework/observable.js';
import {getItemById} from '../utils.js';
import {UpdateType} from '../const.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor({filmsApiService}) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  set films(films) {
    this.#films = films;
  }

  async init() {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT, this.films);
  }

  async updateFilm(updateType, update) {
    const index = getItemById(this.#films, update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  }

  #adaptToClient(film) {
    const adaptedFilm = {...film,
      filmInfo: {
        title: film['film_info'].title,
        alternativeTitle: film['film_info']['alternative_title'],
        poster: film['film_info'].poster,
        totalRating: film['film_info']['total_rating'],
        ageRating: film['film_info']['age_rating'],
        director: film['film_info'].director,
        writers: film['film_info'].writers,
        actors: film['film_info'].actors,
        release: {
          date: film['film_info'].release.date !== null ? new Date(film['film_info'].release.date) : film['film_info'].release.date,
          releaseCountry: film['film_info'].release['release_country']},
        duration: film['film_info'].duration,
        genre: film['film_info'].genre,
        description: film['film_info'].description},
      userDetails: {
        watchlist: film['user_details'].watchlist,
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date'],
        favorite: film['user_details'].favorite}
    };

    // Ненужные ключи мы удаляем
    delete adaptedFilm ['film_info'];
    delete adaptedFilm ['user_details'];

    return adaptedFilm;
  }
}
