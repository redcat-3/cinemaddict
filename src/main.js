import FilmsPresenter from './presenter/films-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import ControlsPresenter from './presenter/controls-presenter.js';
import FilmsModel from './model/films-model.js';
import FilmFiltersModel from './model/film-filters-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsPresenter({
  filmContainer: siteMainElement,
  filmsModel
});
const headerPresenter = new HeaderPresenter({headerContainer: siteHeaderElement});
const filmFiltersmModel = new FilmFiltersModel;
const controlsPresenter = new ControlsPresenter({
  controlsContainer: siteMainElement,
  filmFiltersmModel
});

headerPresenter.init();
controlsPresenter.init();
filmsPresenter.init();
