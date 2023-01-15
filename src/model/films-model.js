import {createFilm, createComments, createFilmDetails} from '../mock/film.js';
import {getFilmById} from '../utils.js';

const FILM_COUNT = 13;

export default class FilmsModel {
  films = Array.from({length: FILM_COUNT}, createFilm);
  #filmDetails = null;
  #comments = null;

  rendercommentsById = (filmId) => {
    this.#comments = createComments(getFilmById(this.films, filmId).comments);
    return this.#comments;
  };

  renderfilmDetailsById = (filmId) => {
    this.#filmDetails = createFilmDetails(getFilmById(this.films, filmId));
    return this.#filmDetails;
  };
}
