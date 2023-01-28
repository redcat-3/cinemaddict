import {render, replace, remove} from '../framework/render.js';
import FilmDetailsView from '../view/film-details.js';
import {UpdateType, UpdateCommentType} from '../const.js';

const body = document.querySelector('body');

export default class FilmDetailsPresenter {
  #filmContainer = null;
  #filmDetailsComponent = null;
  #film = null;
  #handlePopupControlClick = null;
  #popupCallBack = null;
  #isChanged = null;
  #handleUpdateComment = null;

  commentsUpdate = {
    id: null,
    commentList: new Array()
  };

  commentUpdate = {
    id: null,
    author: null,
    comment: null,
    date: null,
    emotion: null
  };

  commentsDelete = [];

  constructor({film, filmContainer, onPopupControlClick, callBackPopup, onCommentUpdate}) {
    this.#film = film;
    this.#filmContainer = filmContainer;
    this.#handlePopupControlClick = onPopupControlClick;
    this.#popupCallBack = callBackPopup;
    this.#handleUpdateComment = onCommentUpdate;
  }

  init(comments) {
    this.#filmDetailsComponent = new FilmDetailsView({
      film: this.#film,
      commentList: comments,
      onClick: () => this.closePopup(),
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
      onUpdateComment: this.#onUpdateComment
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

    if(this.commentsDelete.length) {
      let newCommentList = [];
      for(let i = 0; i < this.commentsDelete.length; i++) {
        newCommentList = this.#filmDetailsComponent.commentList.filter((item) => item.id !== this.commentsDelete[i]);
        this.#filmDetailsComponent.commentList = newCommentList;
      }
      this.#handleUpdateComment(UpdateType.PATCH, this.#filmDetailsComponent.commentList);
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

  #onUpdateComment = (updateCommentType, data) => {
    switch (updateCommentType) {
      case UpdateCommentType.DELETE:
        this.commentsDelete.push(data);
        break;
      case UpdateCommentType.ADD:
        break;
    }

  };

  #handleAddCommentClick = () => {

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
      onFavoriteClick: this.#handleFavoriteClick,
      onUpdateComment: this.#onUpdateComment
    });
    this.#popupCallBack(this.#filmDetailsComponent.closePopup);
    newComponent.setUserControls();
    this.#filmDetailsComponent.setUserControls();
    replace(newComponent, this.#filmDetailsComponent);
    this.#filmDetailsComponent = newComponent;
    document.addEventListener('keydown', this.onEscKeyDown);
    body.classList.add('hide-overflow');
  }
}
