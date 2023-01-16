import dayjs from 'dayjs';

const DATE_FORMAT = 'D MMMM YYYY';

function humanizeDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const getRandomNumber = (min, max) => {
  if (min < 0 || max < 0) {
    return NaN;
  }
  if ((max - min) === 0) {
    return max;
  }
  const result = Math.random() * (max - min);
  if ((max - min) > 0) {
    return Math.round(result + min);
  }
  return Math.round(max - result);
};

const getRandomArray = (array) => {
  const number = getRandomNumber(0, (array.length - 1));
  const randomArray = [0];
  let element = getRandomArrayElement(array);
  for (let i = 0; i < number; i++) {
    while (randomArray.includes(element)) {
      element = getRandomArrayElement(array);
    }
    randomArray[i] = element;
  }
  return randomArray;
};

const getSubArrayFromArray = (count, array) => {
  const number = getRandomNumber(1, count);
  const randomArray = [0];
  for (let i = 0; i < number; i++) {
    const element = getRandomArrayElement(array);
    randomArray[i] = element;
  }
  return randomArray;
};

const getDuration = (duration) => `${Math.round(duration / 60)}h ${duration % 60}m`;

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

const getFilmById = (films, filmId) => films.find(({ id }) => id === filmId);

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

function sortByDate(filmA, filmB) {
  const weight = getWeightForNullDate(filmA.dueDate, filmB.dueDate);

  return weight ?? dayjs(filmA.dueDate).diff(dayjs(filmB.dueDate));
}

export {
  humanizeDate,
  getRandomArrayElement,
  getRandomNumber,
  getRandomArray,
  getSubArrayFromArray,
  getDuration,
  updateItem,
  getFilmById,
  sortByDate};
