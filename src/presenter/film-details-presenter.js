import {render, replace, remove} from '../framework/render.js';
import FilmDetailsView from '../view/film-details.js';
import CommentView from '../view/comment.js';
import {UpdateType, UpdateCommentType} from '../const.js';

const body = document.querySelector('body');

export default class FilmDetailsPresenter {
  #filmContainer = null;
  #filmDetailsComponent = null;
  #film = null;
  #commentsModel = null;
  #handlePopupControlClick = null;
  #popupCallBack = null;
  #handleUpdateComment = null;

  #comments = null;

  commentUpdate = {
    id: null,
    author: null,
    comment: [],
    date: null,
    emotion: null
  };

  commentsDelete = [];

  constructor({film, commentsModel, filmContainer, onPopupControlClick, callBackPopup, onCommentUpdate}) {
    this.#film = film;
    this.#commentsModel = commentsModel;
    this.#filmContainer = filmContainer;
    this.#handlePopupControlClick = onPopupControlClick;
    this.#popupCallBack = callBackPopup;
    this.#handleUpdateComment = onCommentUpdate;

    this.#commentsModel.addObserver(this.#handleCommentsModelEvent);
  }

  init() {
    this.#commentsModel.init(this.#film.id);
    this.#filmDetailsComponent = new FilmDetailsView({
      film: this.#film,
      comments: this.#comments,
      onClick: () => this.closePopup,
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

  #renderComment = (comment) => {
    render(new CommentView(comment, this.#onUpdateComment), document.querySelector('.film-details__comments-list'));
  };

  #removeComments = () => {
    document.querySelector('.film-details__comments-list').innerHTML = '';
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
        newCommentList = this.#filmDetailsComponent.comments.filter((item) => item.id !== data.id);
        this.#filmDetailsComponent.comments = newCommentList;
        this.#handleUpdateComment(UpdateType.PATCH, this.#filmDetailsComponent.comments);
        break;
      case UpdateCommentType.ADD:
        this.commentUpdate = {
          author: 'Keks',
          comment: data.comment,
          date: Date.now(),
          emotion: data.emotion
        };
        newCommentList = this.#filmDetailsComponent.comments.concat(this.commentUpdate);
        this.#filmDetailsComponent.comments = newCommentList;
        this.#handleUpdateComment(UpdateType.PATCH, this.#filmDetailsComponent.comments);
    }
  };

  #handleCommentsModelEvent = (updateType, comments) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmDetailsComponent.comments = comments;
        this.#removeComments();
        comments.forEach((comment) => this.#renderComment(comment));
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
        break;
      case UpdateType.INIT:
        this.#filmDetailsComponent.comments = comments;
        this.#removeComments();
        comments.forEach((comment) => this.#renderComment(comment));
        break;
    }
  };

  remove() {
    remove(this.#filmDetailsComponent);
  }

  replace() {
    this.#commentsModel.init(this.#film.id);
    this.#comments = this.#commentsModel.comments;
    const newComponent = new FilmDetailsView({
      film: this.#film,
      comments: this.#comments,
      onClick: () => this.closePopup,
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
      onUpdateComment: this.#onUpdateComment
    });
    newComponent.setUserControls();
    newComponent.#popupCallBack(this.closePopup);
    replace(newComponent, this.#filmDetailsComponent);
    this.#filmDetailsComponent = newComponent;
    this.#comments.forEach((comment) => this.#renderComment(comment));
    document.addEventListener('keydown', this.onEscKeyDown);
    body.classList.add('hide-overflow');
  }
}
