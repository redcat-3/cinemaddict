import FilmsPresenter from './presenter/films-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import ControlsPresenter from './presenter/controls-presenter.js';
import FilmsModel from './model/films-model.js';
import FilmDetailsModel from './model/film-details-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const filmsModel = new FilmsModel();
const filmDetailsModel = new FilmDetailsModel();
const filmsPresenter = new FilmsPresenter({
  filmContainer: siteMainElement,
  filmsModel,
  filmDetailsModel
});
const headerPresenter = new HeaderPresenter({headerContainer: siteHeaderElement});
const controlsPresenter = new ControlsPresenter({controlsContainer: siteMainElement});

headerPresenter.init();
controlsPresenter.init();
filmsPresenter.init();
