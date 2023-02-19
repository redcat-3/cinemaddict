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

  #state = {
    emotion: null,
    comment: '',
    isDeleting: false,
    isDisabled: false,
    isSaving: false,
    deletingId: null
  };

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
      this.#popupCommentNewComponent = new PopupCommentNewView({
        film: this.#film,
        isSaving: this.#state.isSaving
      });
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

  setAborting(actionType, commentId) {
    if (actionType === UserAction.ADD_COMMENT) {
      this.#popupCommentNewComponent.shake(this.#popupCommentNewComponent.updateElement({isDisabled: false}));
    } else if (actionType === UserAction.DELETE_COMMENT) {
      const shakingCommentView = this.#commentViews.find((commentView) => commentView.id === commentId);

      const resetFormState = () => {
        shakingCommentView.updateElement({isDeleting: false});
      };

      shakingCommentView.shake(resetFormState);
    } else if (actionType === UserAction.UPDATE_FILM) {
      this.#popupFilmControlsComponent.shake();
    }
  }

  setSaving() {
    this.#popupCommentNewComponent.updateElement({
      isSaving: true,
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

  erasePopup = () => {
    remove(this.#popupFilmDetailsComponent);
    remove(this.#popupFilmControlsComponent);
    remove(this.#popupCommentHeaderComponent);
    this.#commentViews.forEach((commentView) => remove(commentView));

    //this.#popupComponent.element.remove();
  };

  removePopup = () => {
    this.#isLoading = true;
    this.#isOpen = false;
    this.#film = null;
    remove(this.#popupCommentContainerComponent);
    remove(this.#popupCommentHeaderComponent);
    remove(this.#popupCommentListComponent);
    this.#commentViews.forEach((commentView) => remove(commentView));
    this.#commentViews.length = 0;
    remove(this.#popupCommentNewComponent);
    remove(this.#popupFilmDetailsComponent);
    remove(this.#popupFilmControlsComponent);
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.removeEventListener('keydown', this.#commentAddHandler);
  };

  #renderLoading() {
    this.#popupCommentLoadingComponent = new PopupCommentLoadingView();
    render(this.#popupCommentLoadingComponent, this.#popupCommentContainerComponent.element.firstElementChild);
  }

  #handleCommentsModelEvent = (updateType, update) => {
    if (updateType === UpdateType.INIT) {
      this.#isLoading = false;
      remove(this.#popupCommentLoadingComponent);
    }
    this.#commentViews.forEach((commentView) => remove(commentView));
    this.#commentViews.length = 0;

    this.#comments = update;
    for (const comment of this.#comments) {
      const commentView = new PopupCommentView({comment, onDeleteClick: this.#handleDeleteClick});
      render(commentView, this.#popupCommentListComponent.element);
      this.#commentViews.push(commentView);
    }
    this.#popupCommentNewComponent.reset();
  };

  #handleFilmsModelEvent = () => {
    if (this.#isOpen) {
      this.erasePopup();
      this.init(this.#filmsModel.films.find((element) => element.id === this.#film.id));
    }
  };

  #handleDeleteClick = (comment, commentComponent) => {
    this.setDeleting(commentComponent);
    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        comment,
        film: this.#film,
        scroll: this.#popupFilmDetailsComponent.scrollPosition,
      }
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
      { film: {...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        }}
      }
    );
  };

  #alreadyWatchedClickHandler = () => {
    this.#handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { film: {...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        }}
      }
    );
  };

  #favoriteClickHandler = () => {
    this.#handleViewAction(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { film: {...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite
        }}
      }
    );
  };
}
