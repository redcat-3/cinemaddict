import {getRandomArrayElement, getRandomNumber, getRandomArray, getSubArrayFromArray} from '../utils.js';

const COMMENT_EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const GENRES = ['Drama', 'Musical', 'Western', 'Comedy', 'Cartoon'];

const MOCK_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'usce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
];

const POSTERS = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg'
];

const TITLES = [
  'Made for each other',
  'Popeye meets sinbad',
  'Sagebrush trail',
  'Santa claus conquers the martians',
  'The dance of life',
  'The great flamarion',
  'The man with the golden arm'
];

const NAMES = [
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryeal',
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Anthony Mann'
];

const COUNTRES = [
  'USA',
  'Russia',
  'Italy',
  'France',
  'China',
  'Korea',
  'Australia'
];

const createComment = (id) => ({
  id: id,
  emotion: getRandomArrayElement(COMMENT_EMOTIONS),
  message: getSubArrayFromArray(3, MOCK_DESCRIPTIONS),
  author: 'Keks',
  date: new Date('2014-01-01'),
});

const createFilm = () => {
  const length = getRandomNumber(0, 10);
  const film = {
    title: getRandomArrayElement(TITLES),
    poster: getRandomArrayElement(POSTERS),
    rating: getRandomNumber(0, 10),
    year: getRandomNumber(1990, 2022),
    duration: getRandomNumber(50, 180),
    genres: getRandomArray(GENRES),
    description: getSubArrayFromArray(4, MOCK_DESCRIPTIONS),
    comments: Array.from({length: length}, () => getRandomNumber(0, length)),
  };
  return film;
};

const createComments = (comments) => comments.map(createComment);

const createFilmDetails = (film) => {
  const {title, poster, rating, year, duration, genres, description, comments} = film;
  const date = new Date(year, getRandomNumber(1, 12), getRandomNumber(1, 28));
  const filmDetails = {
    title: title,
    poster: poster,
    age: getRandomNumber(0, 18),
    titleOriginal: getRandomArrayElement(POSTERS),
    rating: rating,
    director: getRandomArrayElement(NAMES),
    writers: getSubArrayFromArray(3, NAMES),
    actors: getSubArrayFromArray(4, NAMES),
    releaseDate: date,
    duration: duration,
    country: getRandomArrayElement(COUNTRES),
    genres: genres,
    description: description,
    comments: comments,
  };
  return filmDetails;
};

export {createFilm, createComments, createFilmDetails};
