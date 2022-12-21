import {createFilmDetails} from '../mock/film.js';

export default class FilmDetailsModel {
  filmDetails = null;

  constructor({film}) {
    this.filmDetails = createFilmDetails({film});
  }
}
