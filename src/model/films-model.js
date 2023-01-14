import {createFilm, createComments, createFilmDetails} from '../mock/film.js';

const FILM_COUNT = 13;

export default class FilmsModel {
  films = Array.from({length: FILM_COUNT}, createFilm);
  #filmDetails = null;
  #comments = null;

  rendercommentsById = (filmId) => {
    this.#comments = createComments(this.films.find(({ id }) => id === filmId).comments);
    return this.#comments;
  };

  renderfilmDetailsById = (filmId) => {
    this.#filmDetails = createFilmDetails(this.films.find(({ id }) => id === filmId));
    return this.#filmDetails;
  };
}
