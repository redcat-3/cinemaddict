import Observable from '../framework/observable.js';
// import {getFavorit, getWatched, getInWatchlist} from '../utils.js';

export default class FilmFiltersModel extends Observable {
  #all = null;
  #favorite = null;
  #watched = null;
  #watchlist = null;

  currentFilterType = 'all';

  userFilters = {
    all: 0,
    watchlist: 0,
    watched: 0,
    favorite: 0,
  };

  constructor(films) {
    super();
    this.#all = [...films];
    this.#favorite = [...films].filter((film) => film.userDetails.favorite);
    this.#watched = [...films].filter((film) => film.userDetails.alreadyWatched);
    this.#watchlist = [...films].filter((film) => film.userDetails.watchlist);

    this.userFilters = {
      watchlist: this.#watchlist.length,
      watched: this.#watched.length,
      favorite: this.#favorite.length,
    };
  }

  get all() {
    return this.#all;
  }

  set all(films) {
    this.#all = [...films];
  }

  get favorite() {
    return this.#favorite;
  }

  set favorite(films) {
    this.#favorite = [...films].filter((film) => film.userDetails.favorite);
  }

  get watched() {
    return this.#watched;
  }

  set watched(films) {
    this.#watched = [...films].filter((film) => film.userDetails.alreadyWatched);
  }

  get watchlist() {
    return this.#watchlist;
  }

  set watchlist(films) {
    this.#watchlist = [...films].filter((film) => film.userDetails.favorite);
  }

  updateFilter(update) {
    this.currentFilterType = update;
    this._notify(update);
  }
}
