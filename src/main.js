import FilmsPresenter from './presenter/films-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import ControlsPresenter from './presenter/controls-presenter.js';
import FilmsModel from './model/films-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsPresenter({
  filmContainer: siteMainElement,
  filmsModel
});
const headerPresenter = new HeaderPresenter({headerContainer: siteHeaderElement});
const controlsPresenter = new ControlsPresenter({controlsContainer: siteMainElement});

headerPresenter.init();
controlsPresenter.init();
filmsPresenter.init();
