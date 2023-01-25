import Observable from '../framework/observable.js';

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

    this.userFilters = {
      watchlist: this.#all.filter((film) => film.userDetails.watchlist).length,
      watched: this.#all.filter((film) => film.userDetails.alreadyWatched).length,
      favorite: this.#all.filter((film) => film.userDetails.favorite).length,
    };
  }

  get all() {
    return this.#all;
  }

  get favorite() {
    this.#favorite = this.#all.filter((film) => film.userDetails.favorite);
    return this.#favorite;
  }

  get watched() {
    this.#watched = this.#all.filter((film) => film.userDetails.alreadyWatched);
    return this.#watched;
  }

  get watchlist() {
    this.#watchlist = this.#all.filter((film) => film.userDetails.watchlist);
    return this.#watchlist;
  }

  updateFilter(update) {
    this.currentFilterType = update;
    this._notify(update);
  }

  updateData(films) {
    this.#all = [...films];
    this.userFilters = {
      watchlist: this.watchlist.length,
      watched: this.watched.length,
      favorite: this.favorite.length,
    };
    this._notify(this.userFilters);
  }
}
