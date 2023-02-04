import AbstractView from '../framework/view/abstract-view.js';

function createStatisticTemplate(count) {
  return `<p>${count} movies inside</p>`;
}

export default class FooterStatisticView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createStatisticTemplate(this.#count);
  }
}
