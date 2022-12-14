function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const getRandomNumber = (min, max) => {
  if (min < 0 || max < 0) {
    return NaN;
  }
  if ((max - min) === 0) {
    return NaN;
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

const getRandomArrayFromArray = (count, array) => {
  const number = getRandomNumber(0, count);
  const randomArray = [0];
  for (let i = 0; i < number; i++) {
    const element = getRandomArrayElement(array);
    randomArray[i] = element;
  }
  return randomArray;
};

const getDuration = (duration) => `${Math.round(duration / 60)}h ${duration % 60}m`;

export {getRandomArrayElement, getRandomNumber, getRandomArray, getRandomArrayFromArray, getDuration};
