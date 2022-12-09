import NewFilmListView from '../view/film-list.js';
import NewShowMoreView from '../view/button-showmore';
import NewFilmCardView from '../view/film-card.js';
//import NewFilmDetailsView from './view/film-details.js';
import {render} from '../render.js';

export default class FilmsdPresenter {
  filmListComponent = new NewFilmListView();

  constructor({filmContainer}) {
    this.filmContainer = filmContainer;
  }

  init() {
    render(this.filmListComponent, this.filmContainer);

    for (let i = 0; i < 5; i++) {
      render(new NewFilmCardView(), this.filmListComponent.getElement());
    }

    render(new NewShowMoreView(), this.filmListComponent.getElement());
  }
}
