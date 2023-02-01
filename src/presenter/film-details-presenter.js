import {render, replace, remove} from '../framework/render.js';
import FilmDetailsView from '../view/film-details.js';
import {UpdateType, UpdateCommentType} from '../const.js';
import { nanoid } from 'nanoid';

const body = document.querySelector('body');

export default class FilmDetailsPresenter {
  #filmContainer = null;
  #filmDetailsComponent = null;
  #film = null;
  #handlePopupControlClick = null;
  #popupCallBack = null;
  #handleUpdateComment = null;

  commentsUpdate = [];

  commentUpdate = {
    id: null,
    author: null,
    comment: [],
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
    this.#popupCallBack(this.closePopup);
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
    body.classList.remove('hide-overflow');
    this.remove();
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#filmDetailsComponent.setUserControls();
    this.#filmDetailsComponent.controlButtonsClickHandler();
    this.#handlePopupControlClick(UpdateType.PATCH, this.#film);
  };

  #handleWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#filmDetailsComponent.setUserControls();
    this.#filmDetailsComponent.controlButtonsClickHandler();
    this.#handlePopupControlClick(UpdateType.PATCH, this.#film);
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#filmDetailsComponent.setUserControls();
    this.#filmDetailsComponent.controlButtonsClickHandler();
    this.#handlePopupControlClick(UpdateType.PATCH, this.#film);
  };

  #onUpdateComment = (updateCommentType, data) => {
    let newCommentList = [];
    switch (updateCommentType) {
      case UpdateCommentType.DELETE:
        newCommentList = this.#filmDetailsComponent.commentList.filter((item) => item.id !== data);
        this.#filmDetailsComponent.commentList = newCommentList;
        this.#handleUpdateComment(UpdateType.PATCH, this.#filmDetailsComponent.commentList);
        break;
      case UpdateCommentType.ADD:
        this.commentUpdate = {
          id: nanoid(),
          author: 'Keks',
          comment: data.comment,
          date: Date.now(),
          emotion: data.emotion
        };
        this.commentsUpdate.push(this.commentUpdate);
        this.#filmDetailsComponent.addComment(this.commentUpdate);
        newCommentList = this.#filmDetailsComponent.commentList.concat(this.commentsUpdate);
        this.#filmDetailsComponent.commentList = newCommentList;
        this.#handleUpdateComment(UpdateType.PATCH, this.#filmDetailsComponent.commentList);
    }
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
    newComponent.setUserControls();
    newComponent.#popupCallBack(this.closePopup);
    replace(newComponent, this.#filmDetailsComponent);
    this.#filmDetailsComponent = newComponent;
    document.addEventListener('keydown', this.onEscKeyDown);
    body.classList.add('hide-overflow');
  }
}
