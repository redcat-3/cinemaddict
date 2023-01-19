import {render, replace} from '../framework/render.js';
import FilmDetailsView from '../view/film-details.js';

const body = document.querySelector('body');

export default class FilmDetailsPresenter {
  #filmContainer = null;
  #filmDetailsComponent = null;
  #film = null;
  #commentsList = null;
  #handlePopupControlClick = null;
  #popupCallBack = null;

  constructor({film, commentsList, filmContainer, onPopupControlClick, callBackPopup}) {
    this.#film = film;
    this.#commentsList = commentsList;
    this.#filmContainer = filmContainer;
    this.#handlePopupControlClick = onPopupControlClick;
    this.#popupCallBack = callBackPopup;
  }

  init(commentsList) {
    this.#filmDetailsComponent = new FilmDetailsView({
      film: this.#film,
      commentsList,
      onClick: () => this.closePopup(),
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick
    });
    this.#popupCallBack(this.#filmDetailsComponent.closePopup);
    this.#filmDetailsComponent.setUserControls();
    render(this.#filmDetailsComponent, this.#filmContainer);
    document.addEventListener('keydown', this.onEscKeyDown);
    body.classList.add('hide-overflow');
  }

  onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.closePopup();
      document.removeEventListener('keydown', this.onEscKeyDown);
    }
  };

  closePopup() {
    this.#filmContainer.removeChild(document.querySelector('.film-details'));
    body.classList.remove('hide-overflow');
  }

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#filmDetailsComponent.setUserControls();
    this.#handlePopupControlClick(this.#film);
    this.#filmDetailsComponent.controlButtonsClickHandler();
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#filmDetailsComponent.setUserControls();
    this.#handlePopupControlClick(this.#film);
    this.#filmDetailsComponent.controlButtonsClickHandler();
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#filmDetailsComponent.setUserControls();
    this.#handlePopupControlClick(this.#film);
    this.#filmDetailsComponent.controlButtonsClickHandler();
  };

  replace() {
    const newComponent = new FilmDetailsView({
      film: this.#film,
      commentsList: this.#commentsList,
      onClick: () => this.closePopup(),
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    newComponent.setUserControls();
    replace(newComponent, this.#filmDetailsComponent);
    this.#filmDetailsComponent = newComponent;
  }
}
