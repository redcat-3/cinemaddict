import FilmsPresenter from './presenter/films-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import ListFilterPresenter from './presenter/list-filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilmFiltersModel from './model/film-filters-model.js';
import FilmsApiService from './films-api-service.js';
import CommentsApiService from './comments-api-service.js';

const AUTHORIZATION = 'Basic er883jdzbdw';
const END_POINT = 'https://19.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const filmsModel = new FilmsModel({
  filmsApiService: new FilmsApiService(END_POINT, AUTHORIZATION)
});
const commentsModel = new CommentsModel({
  commentsApiService: new CommentsApiService(END_POINT, AUTHORIZATION)
});
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
filmsModel.init();
