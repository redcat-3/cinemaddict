import {createFilm, createComments} from '../mock/film.js';
import {getFilmById} from '../utils.js';

const FILM_COUNT = 13;

export default class FilmsModel {
  films = Array.from({length: FILM_COUNT}, createFilm);
  #comments = null;

  rendercommentsById = (filmId) => {
    this.#comments = createComments(getFilmById(this.films, filmId).comments);
    return this.#comments;
  };
}
