import AbstractView from '../framework/view/abstract-view';
import {getDuration, getReleaseDate} from '../utils.js';
import he from 'he';

function getGenresList(genres) {
  return genres.map((genre) => `<span class="film-details__genre">${he.encode(genre)}</span>`).join('');
}

function createPopupFilmDetailsTemplate(filmCard) {
  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${filmCard.filmInfo.poster} alt="">
          <p class="film-details__age">${filmCard.filmInfo.ageRating}+</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${he.encode(filmCard.filmInfo.title)}</h3>
              <p class="film-details__title-original">Original: ${he.encode(filmCard.filmInfo.alternativeTitle)}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmCard.filmInfo.totalRating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${he.encode(filmCard.filmInfo.director)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${he.encode(filmCard.filmInfo.writers.join(', '))}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${he.encode(filmCard.filmInfo.actors.join(', '))}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${getReleaseDate(filmCard.filmInfo.release.date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Duration</td>
              <td class="film-details__cell">${getDuration(filmCard.filmInfo.duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${he.encode(filmCard.filmInfo.release.releaseCountry)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genre${filmCard.filmInfo.genre.length > 1 ? 's' : ''}</td>
              <td class="film-details__cell">${getGenresList(filmCard.filmInfo.genre)}</td>
            </tr>
          </table>
          <p class="film-details__film-description">${he.encode(filmCard.filmInfo.description)}</p>
        </div>
      </div>
    </div>`
  );
}

export default class PopupFilmDetailsView extends AbstractView {
  #handleXClick = null;
  #film = null;

  constructor({film, onXClick}) {
    super();
    this.#film = film;

    this.#handleXClick = onXClick;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#xClickHandler);
  }

  get template() {
    return createPopupFilmDetailsTemplate(this.#film);
  }

  #xClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleXClick();
  };
}
