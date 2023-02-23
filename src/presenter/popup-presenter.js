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
    this.#film = film;
    this.#commentsModel.init(this.#film.id);

    this.#popupCommentHeaderComponent = new PopupCommentHeaderView(this.#film.comments.length);

    this.#popupFilmDetailsComponent = new PopupFilmDetailsView({
      film: this.#film,
      onXClick: this.removePopup,
    });

    this.#popupFilmControlsComponent = new PopupFilmControlsView({
      film: this.#film,
      isDisabled: false,
      onControlsClick: this.#controlsClickHandler,
      currentFilterType: this.#filterModel.filter,
    });

    if (!this.#popupCommentNewComponent) {
      this.#popupCommentNewComponent = new PopupCommentNewView({
        film: this.#film,
        isSaving: false,
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
      if(this.#popupCommentNewComponent.getFormData()) {
        this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.PATCH, {
          comment: this.#popupCommentNewComponent.getFormData(),
          film: this.#film,
          scroll: this.#popupFilmDetailsComponent.scrollPosition,
        });
        this.#popupCommentNewComponent.reset();
      } else {
        this.setAborting(UserAction.ADD_COMMENT);
      }
    }
  };

  setAborting(actionType, commentId) {
    if (actionType === UserAction.ADD_COMMENT) {
      this.#popupCommentNewComponent.shake(this.#popupCommentNewComponent.reset());
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

  setDisabled() {
    this.#popupFilmControlsComponent.updateElement({
      isDisabled: true,
    });
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
    switch (updateType) {
      case UpdateType.PATCH:
        this.#comments = update.comments;
        this.#commentViews.forEach((commentView) => remove(commentView));
        this.#commentViews.length = 0;
        this.#renderComments(this.#comments);
        this.#popupCommentNewComponent.reset();
        this.#popupCommentHeaderComponent.element.querySelector('.film-details__comments-count').textContent = update.comments.length;
        break;
      case UpdateType.INIT:
        this.#comments = update;
        this.#isLoading = false;
        remove(this.#popupCommentLoadingComponent);
        this.#renderComments(this.#comments);
        break;
      default:
        throw new Error(`Unknown state!, ${updateType}`);
    }
  };

  #renderComments = (comments) => {
    for(const comment of comments) {
      const commentView = new PopupCommentView({comment, onDeleteClick: this.#handleDeleteClick});
      render(commentView, this.#popupCommentListComponent.element);
      this.#commentViews.push(commentView);
    }
  };

  #handleFilmsModelEvent = () => {
    if (this.#isOpen) {
      const film = this.#filmsModel.films.find((element) => element.id === this.#film.id);
      this.#popupFilmControlsComponent.updateElement({film, isDisabled: false});
    }
  };

  #handleDeleteClick = (comment, commentComponent) => {
    this.setDeleting(commentComponent);
    if(this.#commentsModel.comments.some((item) => item.id === comment.id)) {
      this.#handleViewAction(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        {
          comment,
          film: this.#film,
          scroll: this.#popupFilmDetailsComponent.scrollPosition,
        }
      );
    } else {
      commentComponent.shake(commentComponent.updateElement({
        isDeleting: false,
      }));
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.code === 'Escape') {
      evt.preventDefault();
      this.removePopup();
    }
  };

  #controlsClickHandler = (updatedDetails, updateType) => {
    this.#handleViewAction(UserAction.UPDATE_FILM, updateType, {
      film: {...this.#film, userDetails: updatedDetails},
    });
  };
}
