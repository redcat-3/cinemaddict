import { createElement} from '../framework/render.js';
import AbstractView from '../framework/view/abstract-view.js';
import {humanizeDate, getDuration} from '../utils.js';

const EMOJI = {
  smile: './images/emoji/smile.png',
  sleeping: './images/emoji/sleeping.png',
  puke: './images/emoji/puke.png',
  angry: './images/emoji/angry.png',
};

function getGenreWord(genres) {
  if(genres.length === 1) {
    return 'Genre';
  }
  else {
    return 'Genres';
  }
}

function createFilmDetailsTemplate(filmDetails, commentsList) {
  const {title, poster, age, titleOriginal, rating, director, writers, actors, releaseDate, duration, country, genres, description, comments} = filmDetails;
  return `<section class="film-details">
  <div class="film-details__inner">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${poster} alt="">

          <p class="film-details__age">${age}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${titleOriginal}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${humanizeDate(releaseDate)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Duration</td>
              <td class="film-details__cell">${getDuration(duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${getGenreWord(genres)}</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genres.join(' ')}</span></td>
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.lenght}</span></h3>

        <ul class="film-details__comments-list">${commentsList.map((comment) => `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt=${comment.emotion}>
            </span>
            <div>
              <p class="film-details__comment-text">${comment.message.join(' ')}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${comment.date}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>`)}
        </ul>

        <form class="film-details__new-comment" action="" method="get">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </form>
      </section>
    </div>
  </div>
</section>`;
}

function createEmodjiImgTemplate() {
  return '<img width="55" height="55"></img>';
}

function createControlButtonWatchlistTemplate() {
  return '<button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>';
}

function createControlButtonWatchedTemplate() {
  return '<button type="button" class="film-details__control-button film-details__control-button--watched" id="watched" name="watched">Already watched</button>';
}

function createControlButtonFavoriteTemplate() {
  return '<button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>';
}

export default class FilmDetailsView extends AbstractView {
  #filmDetails = null;
  #commentsList = null;
  #onClick = null;
  #handleWatchlistClick = null;
  #handleWatchedClick = null;
  #handleFavoriteClick = null;

  constructor({filmDetails, commentsList, onClick, onWatchlistClick, onWatchedClick, onFavoriteClick}) {
    super();
    this.#filmDetails = filmDetails;
    this.#commentsList = commentsList;
    this.#onClick = onClick;
    this.#handleWatchlistClick = onWatchlistClick;
    this.#handleWatchedClick = onWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#onClick);
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoritelistClickHandler);
    this.element.querySelector('#emoji-smile')
      .addEventListener('click', this.#onEmojiClick);
    this.element.querySelector('#emoji-sleeping')
      .addEventListener('click', this.#onEmojiClick);
    this.element.querySelector('#emoji-puke')
      .addEventListener('click', this.#onEmojiClick);
    this.element.querySelector('#emoji-angry')
      .addEventListener('click', this.#onEmojiClick);
  }

  get template() {
    return createFilmDetailsTemplate(this.#filmDetails, this.#commentsList);
  }

  setUserControls() {
    if(this.#filmDetails.userDetails.watchlist) {
      this.element.querySelector('.film-details__control-button--watchlist').classList.add('film-details__control-button--active');
    }
    if(this.#filmDetails.userDetails.alreadyWatched) {
      this.element.querySelector('.film-details__control-button--watched').classList.add('film-details__control-button--active');
    }
    if(this.#filmDetails.userDetails.favorite) {
      this.element.querySelector('.film-details__control-button--favorite').classList.add('film-details__control-button--active');
    }
  }

  #emojiClickHandler(emodji) {
    this.element.querySelector('.film-details__add-emoji-label').innerHTML = '';
    const pictureTemplateElement = createEmodjiImgTemplate();
    const pictureElement = createElement(pictureTemplateElement);
    pictureElement.src = EMOJI[emodji];
    pictureElement.alt = `emoji-${EMOJI[emodji]}`;
    this.element.querySelector('.film-details__add-emoji-label').appendChild(pictureElement);
  }

  controlButtonsClickHandler() {
    this.element.querySelector('.film-details__controls').innerHTML = '';
    const controlButtonWatchlistTemplateElement = createControlButtonWatchlistTemplate();
    const controlButtonWatchedTemplateElement = createControlButtonWatchedTemplate();
    const controlButtonFavoriteTemplateElement = createControlButtonFavoriteTemplate();
    const controlButtonWatchlistElement = createElement(controlButtonWatchlistTemplateElement);
    const controlButtonWatchedElement = createElement(controlButtonWatchedTemplateElement);
    const controlButtonFavoriteElement = createElement(controlButtonFavoriteTemplateElement);

    this.element.querySelector('.film-details__controls').appendChild(controlButtonWatchlistElement);
    this.element.querySelector('.film-details__controls').appendChild(controlButtonWatchedElement);
    this.element.querySelector('.film-details__controls').appendChild(controlButtonFavoriteElement);

    this.setUserControls();

    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoritelistClickHandler);
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchedClick();
  };

  #favoritelistClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  #onEmojiClick = (evt) => {
    evt.preventDefault();
    this.#emojiClickHandler(evt.target.value);
    evt.target.checked = true;
  };
}
