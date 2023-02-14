import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const NULL_SCROLL = {
  scroll: 0,
};

function createPopupViewTemplate() {
  return `<section class="film-details">
            <div class="film-details__inner">
            </div>
          </section>`;
}

export default class PopupView extends AbstractStatefulView {
  constructor() {
    super();
    this._setState({...NULL_SCROLL});

    this._restoreHandlers();
  }

  get template() {
    return createPopupViewTemplate();
  }

  reset() {
    this.updateElement({...NULL_SCROLL});
  }

  _restoreHandlers() {
    this.element.addEventListener('scroll', this.#scrollChangeHandler);
  }

  restoreScroll() {
    this.element.scrollTop = this._state.scroll;
  }

  #scrollChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      scroll: this.element.scrollTop,
    });
  };
}
