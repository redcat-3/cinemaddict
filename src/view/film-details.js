import {createElement} from '../framework/render.js';
import AbstractView from '../framework/view/abstract-view.js';
import {getReleaseDate, getDuration} from '../utils.js';
import {UpdateCommentType} from '../const.js';

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

function createFilmDetailsTemplate(film) {
  const {filmInfo, comments} = film;
  return `<section class="film-details">
  <div class="film-details__inner">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${filmInfo.poster} alt="">

          <p class="film-details__age">${filmInfo.ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${getReleaseDate(filmInfo.release.date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Duration</td>
              <td class="film-details__cell">${getDuration(filmInfo.duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${getGenreWord(filmInfo.genre)}</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${filmInfo.genre.join(' ')}</span></td>
            </tr>
          </table>

          <p class="film-details__film-description">${filmInfo.description}</p>
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
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
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

// function createCommentTemplate(comment) {
//   return `<li class="film-details__comment" data-comment-id=${comment.id}>
//     <span class="film-details__comment-emoji">
//       <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt=${comment.emotion}>
//     </span>
//     <div>
//       <p class="film-details__comment-text">${he.encode(`${comment.comment}`)}</p>
//       <p class="film-details__comment-info">
//         <span class="film-details__comment-author">${comment.author}</span>
//         <span class="film-details__comment-day">${getCommentDate(comment.date)}</span>
//         <button class="film-details__comment-delete" data-comment-id=${comment.id}>Delete</button>
//       </p>
//     </div>
//   </li>`;
// }

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
  #film = null;
  comments = null;
  #emodjiChecked = null;
  commentText = null;
  #onClick = null;
  #handleWatchlistClick = null;
  #handleWatchedClick = null;
  #handleFavoriteClick = null;
  handleUpdateComment = null;

  constructor({film, comments, onClick, onWatchlistClick, onWatchedClick, onFavoriteClick, onUpdateComment}) {
    super();
    this.#film = film;
    this.comments = comments;
    this.#onClick = onClick;
    this.#handleWatchlistClick = onWatchlistClick;
    this.#handleWatchedClick = onWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.handleUpdateComment = onUpdateComment;

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

    this.element.querySelector('.film-details__comment-input').addEventListener('keypress', this.#keycheck);
  }

  get template() {
    return createFilmDetailsTemplate(this.#film);
  }

  setUserControls() {
    if(this.#film.userDetails.watchlist) {
      this.element.querySelector('.film-details__control-button--watchlist').classList.add('film-details__control-button--active');
    }
    if(this.#film.userDetails.alreadyWatched) {
      this.element.querySelector('.film-details__control-button--watched').classList.add('film-details__control-button--active');
    }
    if(this.#film.userDetails.favorite) {
      this.element.querySelector('.film-details__control-button--favorite').classList.add('film-details__control-button--active');
    }
  }

  #emojiClickHandler() {
    this.element.querySelector('.film-details__add-emoji-label').innerHTML = '';
    const pictureTemplateElement = createEmodjiImgTemplate();
    const pictureElement = createElement(pictureTemplateElement);
    pictureElement.src = EMOJI[this.#emodjiChecked];
    pictureElement.alt = `emoji-${EMOJI[this.#emodjiChecked]}`;
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

  // addComment(data) {
  //   this.element.querySelector('.film-details__add-emoji-label').innerHTML = '';
  //   const commentTemplateElement = createCommentTemplate(data);
  //   const commentElement = createElement(commentTemplateElement);
  //   this.element.querySelector('.film-details__comment-input').value = '';
  //   this.element.querySelector('.film-details__comments-list').appendChild(commentElement);
  // }

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
    this.#emodjiChecked = evt.target.value;
    this.#emojiClickHandler();
    evt.target.checked = true;
  };

  #keycheck = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.keyCode === 13) {
      evt.preventDefault();
      this.commentText = evt.target.value;
      this.onAddCommentSubmit();
      evt.target.disabled = true;
    }
  };

  onAddCommentSubmit = () => {
    if(this.#emodjiChecked) {
      const comment = {
        comment: this.commentText,
        emotion: this.#emodjiChecked
      };
      this.handleUpdateComment(UpdateCommentType.ADD, this.#film.id, comment);
    }
  };
}
