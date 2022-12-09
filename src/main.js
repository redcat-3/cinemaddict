import NewListFilterView from './view/list-filter.js';
import NewProfileView from './view/profile.js';
import NewSortListView from './view/sort.js';
import {render} from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const filmsPresenter = new FilmsPresenter({filmContainer: siteMainElement});

render(new NewProfileView(), siteHeaderElement);
render(new NewListFilterView(), siteMainElement);
render(new NewSortListView(), siteMainElement);

filmsPresenter.init();
