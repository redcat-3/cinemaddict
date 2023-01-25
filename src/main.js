import FilmsPresenter from './presenter/films-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import ListFilterPresenter from './presenter/list-filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilmFiltersModel from './model/film-filters-model.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel.films);
const filmFiltersModel = new FilmFiltersModel(filmsModel.films);
const filmsPresenter = new FilmsPresenter({
  filmContainer: siteMainElement,
  filmsModel,
  commentsModel,
  filmFiltersModel
});
const headerPresenter = new HeaderPresenter({headerContainer: siteHeaderElement});

const listFilterPresenter = new ListFilterPresenter({
  listFilterContainer: siteMainElement,
  filmFiltersModel
});

headerPresenter.init();
listFilterPresenter.init();
filmsPresenter.init();
