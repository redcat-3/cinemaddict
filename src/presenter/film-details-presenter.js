import {render} from '../framework/render.js';
import FilmDetailsView from '../view/film-details.js';

const body = document.querySelector('body');

export default class FilmDetailsPresenter {
  #filmContainer = null;
  #filmDetailsComponent = null;
  #filmDetails = null;
  #commentsList = null;

  constructor({filmDetails, commentsList, filmContainer}) {
    this.#filmDetails = filmDetails;
    this.#commentsList = commentsList;
    this.#filmContainer = filmContainer;
  }

  init(filmDetails, commentsList) {
    this.#filmDetailsComponent = new FilmDetailsView({
      filmDetails,
      commentsList,
      onClick: () => this.closePopup()
    });

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
}
