import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { EMOJI } from '../const.js';
import he from 'he';

const createNewEmodjiTemplate = (currentEmotion, isSaving) => EMOJI.map((emotion) => (`
    <input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emotion}" value="${emotion}"
      ${currentEmotion === emotion ? 'checked' : ''}
      ${isSaving ? 'disabled' : ''}
      >
    <label
      class="film-details__emoji-label"
      for="emoji-${emotion}">
        <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>
  `)).join('');

function createPopupCommentNewTemplate(state) {
  const {emotion, isSaving, comment} = state;
  const newEmodjiTemplate = createNewEmodjiTemplate(emotion, isSaving);
  return (
    `<form class="film-details__new-comment" action="" method="get">
      <div class="film-details__add-emoji-label">
        ${emotion ? `<img src="images/emoji/${emotion}.png" alt="emoji-smile" width="55" height="55">` : ''}
      </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"
            ${isSaving ? ' disabled' : ''}>${he.encode(comment)}</textarea>
        </label>
        <div class="film-details__emoji-list">
        ${newEmodjiTemplate}
        </div>
    </form>`
  );
}

export default class PopupCommentNewView extends AbstractStatefulView {
  #film = null;

  constructor({isSaving}, onFormSubmit, film) {
    super();
    this.#film = film;
    this._setState ({
      emotion: null,
      comment: '',
      isSaving
    });

    this._restoreHandlers();
  }

  get template() {
    return createPopupCommentNewTemplate(this._state);
  }

  reset = () => {
    this.updateElement(this._state);
  };

  _restoreHandlers() {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#chooseEmojiHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      comment: he.encode(evt.target.value),
    });
  };

  getFormData() {
    if(this._state.comment === null || this._state.comment === '' || this._state.emotion === null ) {
      return null;
    }
    return {
      comment: this._state.comment,
      emotion: this._state.emotion,
    };
  }

  #chooseEmojiHandler = (evt) => {
    evt.preventDefault();
    if (!this._state.isSaving) {
      this.updateElement({
        emotion: evt.target.dataset.emoji,
      });
    }
  };
}
