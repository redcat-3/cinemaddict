import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsPresenter from './film-details-presenter.js';

export default class FilmPresenter {
  #filmContainer = null;

  #filmComponent = null;
  #film = null;
  #handleControlClick = null;
  #popupCallBack = null;

  constructor({film, filmContainer, onControlClick, popupCallBack}) {
    this.#filmContainer = filmContainer;
    this.#film = film;
    this.#handleControlClick = onControlClick;
    this.#popupCallBack = popupCallBack;
  }

  init(filmDetails, commentsList) {
    this.#filmComponent = new FilmCardView({
      film: this.#film,
      onClick:() => {
        const filmDetailsPresenter = new FilmDetailsPresenter({
          filmDetails,
          commentsList,
          filmContainer: this.#filmContainer,
          onPopupControlClick: this.#handlePopupControlClick
        });
        filmDetailsPresenter.init(filmDetails, commentsList);
      },
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
      callBackPopup: this.#popupCallBack
    });

    this.#filmComponent.setUserControls();
    render(this.#filmComponent, this.#filmContainer);
  }

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#filmComponent.setUserControls();
    this.#handleControlClick(this.#film);
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#filmComponent.setUserControls();
    this.#handleControlClick(this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#filmComponent.setUserControls();
    this.#handleControlClick(this.#film);
  };

  #handlePopupControlClick = (update) => {
    this.#film.userDetails.watchlist = update.userDetails.watchlist;
    this.#film.userDetails.alreadyWatched = update.userDetails.alreadyWatched;
    this.#film.userDetails.favorite = update.userDetails.favorite;
    this.#filmComponent.setUserControls();
    this.#handleControlClick(this.#film);
  };

  remove() {
    remove(this.#filmComponent);
  }

  replace(filmDetails, commentsList) {
    const newComponent = new FilmCardView({
      film: this.#film,
      onClick:() => {const filmDetailsPresenter = new FilmDetailsPresenter({
        filmDetails,
        commentsList,
        filmContainer: this.#filmContainer,
        onPopupControlClick: this.#handlePopupControlClick
      });
      filmDetailsPresenter.init(filmDetails, commentsList);},
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    newComponent.setUserControls();
    replace(newComponent, this.#filmComponent);
    this.#filmComponent = newComponent;
  }
}


