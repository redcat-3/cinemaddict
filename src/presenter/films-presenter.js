import FilmListView from '../view/film-list.js';
import ShowMoreView from '../view/button-showmore';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import EmptyView from '../view/empty.js';
import {render} from '../render.js';

const FILM_COUNT_PER_STEP = 5;

const body = document.querySelector('body');

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;

  #filmListComponent = new FilmListView();

  #listOfFilms = [];
  #showMoreComponent = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor({filmContainer, filmsModel}) {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
  }

  init() {
    this.#listOfFilms = [...this.#filmsModel.films];

    render(this.#filmListComponent, this.#filmContainer);

    if(this.#listOfFilms.length === 0) {
      render(new EmptyView(), this.#filmListComponent.element.querySelector('.films-list__container'));
    } else {
      for (let i = 0; i < Math.min(this.#listOfFilms.length, FILM_COUNT_PER_STEP); i++) {
        render(new FilmCardView({film: this.#listOfFilms[i], onClick: () => this. renderFilmDetailsPopupById(i)}), this.#filmListComponent.element.querySelector('.films-list__container'));
      }

      if (this.#listOfFilms.length > FILM_COUNT_PER_STEP) {
        this.#showMoreComponent = new ShowMoreView();
        render(this.#showMoreComponent, this.#filmListComponent.element.querySelector('.films-list'));

        this.#showMoreComponent.element.addEventListener('click', this.#showMoreClickHandler);
      }
    }
  }

  escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.closePopupControl();
      document.removeEventListener('keydown', this.escKeyDownHandler);
    }
  };

  renderFilmDetailsPopupById(filmId) {
    const filmDetails = this.#filmsModel.renderfilmDetailsById(filmId);
    const commentsList = this.#filmsModel.rendercommentsById(filmId);
    render(new FilmDetailsView({filmDetails: filmDetails, commentsList: commentsList}),
      this.#filmListComponent.element.querySelector('.films-list__container'));
    document.addEventListener('keydown', this.escKeyDownHandler);
  }

  closePopupControl = () => {
    this.#filmListComponent.element.querySelector('.films-list__container').removeChild(document.querySelector('.film-details'));
    body.classList.remove('hide-overflow');
  };

  #showMoreClickHandler = (evt) => {
    evt.preventDefault();
    this.#listOfFilms
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((_, index) => render(new FilmCardView({film: this.#listOfFilms[index + this.#renderedFilmCount], onClick: () => this.renderFilmDetailsPopupById(index + this.#renderedFilmCount)}), this.#filmListComponent.element.querySelector('.films-list__container')));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listOfFilms.length) {
      this.#showMoreComponent.element.remove();
      this.#showMoreComponent.removeElement();
    }
  };
}
