import {render, replace} from '../framework/render.js';
import FilmDetailsView from '../view/film-details.js';

const body = document.querySelector('body');

export default class FilmDetailsPresenter {
  #filmContainer = null;
  #filmDetailsComponent = null;
  #filmDetails = null;
  #commentsList = null;
  #handlePopupControlClick = null;
  #popupCallBack = null;

  constructor({filmDetails, commentsList, filmContainer, onPopupControlClick, callBackPopup}) {
    this.#filmDetails = filmDetails;
    this.#commentsList = commentsList;
    this.#filmContainer = filmContainer;
    this.#handlePopupControlClick = onPopupControlClick;
    this.#popupCallBack = callBackPopup;
  }

  init(filmDetails, commentsList) {
    this.#filmDetailsComponent = new FilmDetailsView({
      filmDetails,
      commentsList,
      onClick: () => this.closePopup(),
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick
    });
    //this.#popupCallBack(this.closePopup);
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

  closePopup = () => {
    this.#filmContainer.removeChild(document.querySelector('.film-details'));
    body.classList.remove('hide-overflow');
  };

  #handleWatchlistClick = () => {
    this.#filmDetails.userDetails.watchlist = !this.#filmDetails.userDetails.watchlist;
    this.#filmDetailsComponent.setUserControls();
    this.#handlePopupControlClick(this.#filmDetails);
    this.replace();
  };

  #handleWatchedClick = () => {
    this.#filmDetails.userDetails.alreadyWatched = !this.#filmDetails.userDetails.alreadyWatched;
    this.#filmDetailsComponent.setUserControls();
    this.#handlePopupControlClick(this.#filmDetails);
    this.replace();
  };

  #handleFavoriteClick = () => {
    this.#filmDetails.userDetails.favorite = !this.#filmDetails.userDetails.favorite;
    this.#filmDetailsComponent.setUserControls();
    this.#handlePopupControlClick(this.#filmDetails);
    this.replace();
  };

  replace() {
    const newComponent = new FilmDetailsView({
      filmDetails: this.#filmDetails,
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
