import dayjs from 'dayjs';

const FILM_DATE_FORMAT = 'YYYY';
const RELEASE_DATE_FORMAT = 'D MMMM YYYY';
const COMMENT_DATE_FORMAT = 'YYYY/MM/DD HH:mm';

function getReleaseDate(date) {
  return date ? dayjs(date).format(RELEASE_DATE_FORMAT) : '';
}

function getFilmYear(date) {
  return date ? dayjs(date).format(FILM_DATE_FORMAT) : '';
}

function getCommentDate(date) {
  return date ? dayjs(date).format(COMMENT_DATE_FORMAT) : '';
}

const getDuration = (duration) => `${Math.round(duration / 60)}h ${duration % 60}m`;

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

const getItemById = (items, itemId) => items.find((item) => item.id === itemId);

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortByReleaseDate(filmA, filmB) {
  const weight = getWeightForNullDate(filmA.filmInfo.release.date, filmB.filmInfo.release.date);
  return weight ?? dayjs(filmA.filmInfo.release.date).diff(dayjs(filmB.filmInfo.release.date));
}

export {
  getReleaseDate,
  getFilmYear,
  getCommentDate,
  getDuration,
  updateItem,
  getItemById,
  sortByReleaseDate};
