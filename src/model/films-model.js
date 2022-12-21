import {createFilm, createComments, createFilmDetails} from '../mock/film.js';

const FILM_COUNT = 0;

export default class FilmsModel {
  #films = Array.from({length: FILM_COUNT}, createFilm);
  #filmDetails = null;
  #comments = null;

  get films() {
    return this.#films;
  }

  rendercommentsById = (id) => {
    this.#comments = createComments(this.#films[id].comments);
    return this.#comments;
  };

  renderfilmDetailsById = (id) => {
    this.#filmDetails = createFilmDetails(this.#films[id]);
    return this.#filmDetails;
  };
}
