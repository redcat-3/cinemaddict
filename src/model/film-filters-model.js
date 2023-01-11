import {createUserFilters} from '../mock/film.js';

export default class FilmFiltersModel {
  userFilters = {
    watchlist: 0,
    watched: 0,
    favorite: 0,
  };


  constructor() {
    this.userFilters = createUserFilters();
  }
}
