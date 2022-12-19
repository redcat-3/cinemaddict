import FilmListView from '../view/film-list.js';
import ShowMoreView from '../view/button-showmore';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import {render} from '../render.js';

const FILM_COUNT_PER_STEP = 8;

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
    this.#listOfFilms = [...this.#filmsModel.films()];

    render(this.#filmListComponent, this.#filmContainer);

    for (let i = 0; i < Math.min(this.#listOfFilms.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#listOfFilms[i]);
    }

    if (this.#listOfFilms.length > FILM_COUNT_PER_STEP) {
      this.#showMoreComponent = new ShowMoreView();
      render(this.#showMoreComponent, this.#filmListComponent.element().querySelector('.films-list'));

      this.#showMoreComponent.element.addEventListener('click', this.#showMoreClickHandler);
    }
  }

  #showMoreClickHandler = (evt) => {
    evt.preventDefault();
    this.#listOfFilms
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listOfFilms.length) {
      this.#showMoreComponent.element.remove();
      this.#showMoreComponent.removeElement();
    }
  };

  #renderFilm(film) {
    const filmComponent = new FilmCardView({film});
    const filmDetailsComponent = new FilmDetailsView({film});
    const body = document.querySelector('body');

    const showFilmDetails = () => {
      this.#filmListComponent.element.appendChild(filmDetailsComponent.element);
      body.classList.add('hide-overflow');
    };

    const hideFilmDetails = () => {
      this.#filmListComponent.element.removeChild(filmDetailsComponent.element);
      body.classList.remove('hide-overflow');
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        hideFilmDetails();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    filmComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      hideFilmDetails();
    });

    filmComponent.element.querySelector('a').addEventListener('click', () => {
      showFilmDetails();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    render(filmComponent, this.#filmListComponent.element().querySelector('.films-list__container'));
  }
}
