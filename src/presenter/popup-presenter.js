import PopupView from '../view/popup-view.js';
import PopupFilmDetailsView from '../view/popup-film-details-view.js';
import PopupFilmControlsView from '../view/popup-film-controls-view.js';
import PopupCommentContainerView from '../view/popup-comment-container-view.js';
import PopupCommentHeaderView from '../view/popup-comment-header-view.js';
import PopupCommentListView from '../view/popup-comment-list-view.js';
import PopupCommentNewView from '../view/popup-comment-new-view.js';
import PopupCommentView from '../view/popup-comment-view.js';
import PopupCommentLoadingView from '../view/popup-comment-loading-view.js';

import { isCtrlEnterEvent } from '../utils';
import { remove, render, RenderPosition } from '../framework/render';
import { UpdateType, UserAction } from '../const';
//import FilmPopupView from '../view/film-popup-view';

export default class PopupPresenter {
  #popupComponent = new PopupView();
  #popupCommentContainerComponent = new PopupCommentContainerView();
  #popupCommentListComponent = new PopupCommentListView();

  #film = null;
  #commentsModel = null;
  #filterModel = null;
  #filmsModel = null;
  #handleViewAction = null;

  #popupFilmDetailsComponent = null;
  #popupFilmControlsComponent = null;
  #popupCommentHeaderComponent = null;
  #popupCommentNewComponent = null;
  #popupCommentLoadingComponent = null;

  #comments = [];
  #commentViews = [];

  #isLoading = true;
  #isOpen = false;

  constructor({filmsModel, commentsModel, onViewAction, filterModel}) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#handleViewAction = onViewAction;

    this.#filmsModel.addObserver(this.#handleFilmsModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentsModelEvent);
  }

  get isOpen() {
    return this.#isOpen;
  }

  init(film) {
    if (this.#isOpen) {
      this.removePopup();
    }

    this.#film = film;
    this.#commentsModel.init(this.#film.id);

    this.#popupCommentHeaderComponent = new PopupCommentHeaderView(this.#film);

    this.#popupFilmDetailsComponent = new PopupFilmDetailsView({
      film: this.#film,
      onXClick: this.removePopup,
    });

    this.#popupFilmControlsComponent = new PopupFilmControlsView({
      film: this.#film,
      onWatchlistClick: this.#watchlistClickHandler,
      onAlreadyWatchedClick: this.#alreadyWatchedClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    if (!this.#popupCommentNewComponent) {
      this.#popupCommentNewComponent = new PopupCommentNewView({onFormSubmit: this.#handleFormSubmit, film: this.#film});
    }

    render(this.#popupComponent, document.body);

    render(this.#popupFilmDetailsComponent, this.#popupComponent.element.firstElementChild);
    render(this.#popupFilmControlsComponent, this.#popupComponent.element.firstElementChild, RenderPosition.BEFOREEND);

    render(this.#popupCommentContainerComponent, this.#popupComponent.element.firstElementChild);
    render(this.#popupCommentHeaderComponent, this.#popupCommentContainerComponent.element.firstElementChild);
    if (this.#isLoading) {
      this.#renderLoading();
    }
    render(this.#popupCommentListComponent, this.#popupCommentContainerComponent.element.firstElementChild);
    render(this.#popupCommentNewComponent, this.#popupCommentContainerComponent.element.firstElementChild);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.addEventListener('keydown', this.#commentAddHandler);
    this.#isOpen = true;
  }

  #commentAddHandler = (evt) => {
    if (isCtrlEnterEvent(evt)) {
      evt.preventDefault();
      this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.PATCH, {
        comment: this.#popupCommentNewComponent.getFormData(),
        film: this.#film,
        scroll: this.#popupFilmDetailsComponent.scrollPosition,
      });
    }
  };

  setAborting(actionType, comment) {
    if (actionType === UserAction.ADD_COMMENT) {
      this.#popupCommentNewComponent.shake(this.#popupCommentNewComponent.updateElement({isDisabled: false}));
    } else if (actionType === UserAction.DELETE_COMMENT) {
      const shakingCommentView = this.#commentViews.find((commentView) => commentView.id === comment.id);

      const resetFormState = () => {
        shakingCommentView.updateElement({isDeleting: false});
      };

      shakingCommentView.shake(resetFormState);
    } else if (actionType === UserAction.UPDATE_FILM) {
      this.#popupFilmControlsComponent.shake();
    }
  }

  setDisabled() {
    this.#popupCommentNewComponent.updateElement({
      isDisabled: true,
    });
  }

  setDeleting(commentComponent) {
    commentComponent.updateElement({
      isDeleting: true,
    });
  }

  resetForm = () => {
    this.#popupCommentNewComponent.reset();
  };

  earsePopup = () => {
    remove(this.#popupFilmDetailsComponent);
    remove(this.#popupFilmControlsComponent);
    remove(this.#popupCommentHeaderComponent);
    this.#commentViews.forEach((commentView) => remove(commentView));

    this.#popupComponent.element.remove();
  };

  removePopup = () => {
    document.body.classList.remove('hide-overflow');
    document.body.removeEventListener('keydown', this.#escKeyDownHandler);

    remove(this.#popupComponent);
    this.#popupComponent.reset();

    remove(this.#popupCommentContainerComponent);
    remove(this.#popupCommentHeaderComponent);
    remove(this.#popupCommentListComponent);
    this.#commentViews.forEach((commentView) => remove(commentView));

    remove(this.#popupCommentNewComponent);
    this.#popupCommentNewComponent?.reset();

    remove(this.#popupFilmDetailsComponent);
    remove(this.#popupFilmControlsComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.removeEventListener('keydown', this.#commentAddHandler);
    this.#isLoading = true;
  };

  #renderLoading() {
    this.#popupCommentLoadingComponent = new PopupCommentLoadingView();
    render(this.#popupCommentLoadingComponent, this.#popupCommentContainerComponent.element.firstElementChild);
  }

  #handleCommentsModelEvent = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.#isLoading = false;
      remove(this.#popupCommentLoadingComponent);
    }

    this.#comments = this.#commentsModel.comments;
    for (const comment of this.#comments) {
      const commentView = new PopupCommentView({comment, onDeleteClick: this.#handleDeleteClick});
      render(commentView, this.#popupCommentListComponent.element);
      this.#commentViews.push(commentView);
    }
  };

  #handleFilmsModelEvent = () => {
    if (this.#isOpen) {
      this.earsePopup();
      this.init( this.#filmsModel.films.find( (element) => element.id === this.#film.id ) );
    }
  };

  #handleFormSubmit = (comment) => {
    this.setDisabled();

    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      comment,
    );
  };

  #handleDeleteClick = (comment, commentComponent) => {
    this.setDeleting(commentComponent);

    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      comment,
      this.#film
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.code === 'Escape') {
      evt.preventDefault();
      this.removePopup();
    }
  };

  #watchlistClickHandler = () => {
    this.#handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        }
      },
      this,
    );
  };

  #alreadyWatchedClickHandler = () => {
    this.#handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        }
      },
      this,
    );
  };

  #favoriteClickHandler = () => {
    this.#handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite
        }
      },
      this,
    );
  };
}
