import NewFilmListView from '../view/film-list.js';
import NewShowMoreView from '../view/button-showmore';
import NewFilmCardView from '../view/film-card.js';
//import NewFilmDetailsView from './view/film-details.js';
import {render} from '../render.js';

export default class FilmsPresenter {
  filmListComponent = new NewFilmListView();

  constructor({filmContainer, filmsModel}) {
    this.filmContainer = filmContainer;
    this.filmsModel = filmsModel;
    // this.filmDetails = filmDetails;
  }

  init() {
    this.listOfFilms = [...this.filmsModel.getFilms()];
    // this.filmDetails = this.filmDetails.getFilmDetails();

    render(this.filmListComponent, this.filmContainer);

    for (let i = 0; i < this.listOfFilms.length; i++) {
      render(new NewFilmCardView({film: this.listOfFilms[i]}), this.filmListComponent.getElement().querySelector('.films-list__container'));
    }

    render(new NewShowMoreView(), this.filmListComponent.getElement().querySelector('.films-list'));
    // render(new NewFilmDetailsView({filmDetails: this.filmDetails}), this.filmListComponent.getElement().querySelector('.films-list'));
  }
}
