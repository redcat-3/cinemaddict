import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsPresenter from './film-details-presenter.js';
import {UpdateType} from '../const.js';

export default class FilmPresenter {
  #filmContainer = null;
  #filmComponent = null;
  #film = null;
  #handleControlClick = null;
  #popupCallBack = null;
  #handleViewAction = null;
  #handleUpdateComment = null;


  constructor({film, filmContainer, onControlClick, popupCallBack, onViewAction, onCommentUpdate}) {
    this.#filmContainer = filmContainer;
    this.#film = film;
    this.#handleControlClick = onControlClick;
    this.#popupCallBack = popupCallBack;
    this.#handleViewAction = onViewAction;
    this.#handleUpdateComment = onCommentUpdate;
  }

  init(commentsList) {
    this.#filmComponent = new FilmCardView({
      film: this.#film,
      onClick:() => {
        const filmDetailsPresenter = new FilmDetailsPresenter({
          film: this.#film,
          commentsList,
          filmContainer: this.#filmContainer,
          onPopupControlClick: this.#handlePopupControlClick,
          callBackPopup: this.#popupCallBack,
          onCommentUpdate: this.#commentUpdateHandler
        });
        filmDetailsPresenter.init(commentsList);
      },
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#filmComponent.setUserControls();
    render(this.#filmComponent, this.#filmContainer);
  }

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#filmComponent.setUserControls();
    this.#handleControlClick(
      UpdateType.PATCH,
      this.#film
    );
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#filmComponent.setUserControls();
    this.#handleControlClick(
      UpdateType.PATCH,
      this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#filmComponent.setUserControls();
    this.#handleControlClick(
      UpdateType.PATCH,
      this.#film);
  };

  #handlePopupControlClick = (updateType, update) => {
    this.#film.userDetails.watchlist = update.userDetails.watchlist;
    this.#film.userDetails.alreadyWatched = update.userDetails.alreadyWatched;
    this.#film.userDetails.favorite = update.userDetails.favorite;
    this.#filmComponent.setUserControls();
    this.#handleControlClick(updateType, update);
    this.#handleViewAction(updateType, update);
  };

  #commentUpdateHandler = (updateType, update) => {
    const newComments = Array.from(update, (element) => element.id);
    this.#film.comments = newComments;
    this.#handleViewAction(updateType, this.#film);
    this.#handleUpdateComment(this.#film.id, update);
  };

  remove() {
    remove(this.#filmComponent);
  }

  replace(commentsList) {
    const newComponent = new FilmCardView({
      film: this.#film,
      onClick:() => {const filmDetailsPresenter = new FilmDetailsPresenter({
        film: this.#film,
        commentsList,
        filmContainer: this.#filmContainer,
        onPopupControlClick: this.#handlePopupControlClick,
        callBackPopup: this.#popupCallBack,
        onCommentUpdate: this.#commentUpdateHandler
      });
      filmDetailsPresenter.init(commentsList);},
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick
    });
    newComponent.setUserControls();
    replace(newComponent, this.#filmComponent);
    this.#filmComponent = newComponent;
  }
}


