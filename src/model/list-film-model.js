import {createUserFilters} from '../mock/film.js';

export default class ListFilmModel {
  userFilters = null;

  constructor() {
    this.userFilters = createUserFilters();
  }
}
