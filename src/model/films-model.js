import Observable from '../framework/observable.js';
import {createFilm} from '../mock/film.js';
// import {getFilmById} from '../utils.js';

const FILM_COUNT = 13;

export default class FilmsModel extends Observable {
  #films = Array.from({length: FILM_COUNT}, createFilm);

  get films() {
    return this.#films;
  }

  set films(films) {
    this.#films = films;
  }

  updateFilm(update) {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(update);
  }

  // renderCommentsById = (filmId) => {
  //   this.#comments = createComments(getFilmById(this.films, filmId).comments);
  //   return this.#comments;
  // };
}
