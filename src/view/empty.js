import AbstractView from '../framework/view/abstract-view.js';

const TitleByFilter = {
  all: 'There are no movies in our database',
  watchlist: 'There are no movies to watch now',
  watched: 'There are no watched movies now',
  favorite: 'There are no favorite movies now'
};


function createEmptyTemplate() {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
}

export default class EmptyView extends AbstractView {
  #element = null;

  get template() {
    return createEmptyTemplate();
  }

  setTitle = (currentFilter) => {
    const title = TitleByFilter[currentFilter];
    return `<h2 class="films-list__title">${title}</h2>`;
  };
}
