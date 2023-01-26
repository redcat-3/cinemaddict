import {render, replace, remove} from '../framework/render.js';
import FilmDetailsView from '../view/film-details.js';
import {UpdateType} from '../const.js';

const body = document.querySelector('body');

export default class FilmDetailsPresenter {
  #filmContainer = null;
  #filmDetailsComponent = null;
  #film = null;
  #handlePopupControlClick = null;
  #popupCallBack = null;
  #isChanged = null;

  constructor({film, filmContainer, onPopupControlClick, callBackPopup}) {
    this.#film = film;
    this.#filmContainer = filmContainer;
    this.#handlePopupControlClick = onPopupControlClick;
    this.#popupCallBack = callBackPopup;
  }

  init(comments) {
    this.#filmDetailsComponent = new FilmDetailsView({
      film: this.#film,
      commentList: comments,
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
      document.removeEventListener('keydown', this.onEscKeyDown);
      this.closePopup();
    }
  };

  closePopup = () => {
    if(this.#isChanged) {
      this.#handlePopupControlClick(UpdateType.PATCH, this.#film);
    }
    body.classList.remove('hide-overflow');
    this.remove();
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#filmDetailsComponent.setUserControls();
    this.#filmDetailsComponent.controlButtonsClickHandler();
    this.#isChanged = true;
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#filmDetailsComponent.setUserControls();
    this.#filmDetailsComponent.controlButtonsClickHandler();
    this.#isChanged = true;
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#filmDetailsComponent.setUserControls();
    this.#filmDetailsComponent.controlButtonsClickHandler();
    this.#isChanged = true;
  };

  remove() {
    remove(this.#filmDetailsComponent);
  }

  replace(commentList) {
    const newComponent = new FilmDetailsView({
      film: this.#film,
      commentList,
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
