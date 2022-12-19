import {createFilmDetails} from '../mock/film.js';

export default class FilmDetailsModel {
  filmDetails = createFilmDetails();

  getFilmDetails() {
    return this.filmDetails;
  }
}
