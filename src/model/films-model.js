import {createFilm} from '../mock/film.js';

const FILM_COUNT = 25;

export default class FilmsModel {
  #films = Array.from({length: FILM_COUNT}, createFilm);

  get films() {
    return this.#films;
  }
}
