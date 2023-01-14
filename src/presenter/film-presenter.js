import {render} from '../framework/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsPresenter from './film-details-presenter.js';

export default class FilmPresenter {
  #filmContainer = null;

  #filmComponent = null;
  #film = null;
  #handleControlClick = null;

  constructor({film, filmContainer, onControlClick}) {
    this.#filmContainer = filmContainer;
    this.#film = film;
    this.#handleControlClick = onControlClick;
  }

  init(filmDetails, commentsList) {
    this.#filmComponent = new FilmCardView({
      film: this.#film,
      onClick:() => {const filmDetailsPresenter = new FilmDetailsPresenter({
        filmDetails,
        commentsList,
        filmContainer: this.#filmContainer
      });
      filmDetailsPresenter.init(filmDetails, commentsList);},
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#filmComponent.setUserControls();
    render(this.#filmComponent, this.#filmContainer);
  }

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#handleControlClick(this.#film);
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.watched = !this.#film.userDetails.watched;
    this.#handleControlClick(this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#handleControlClick(this.#film);
  };
}


