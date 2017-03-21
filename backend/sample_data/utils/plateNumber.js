'use strict';

const toUpperCase = (s) => s.toUpperCase();

const plateNumber = {
  localGovtAreas: require('./localGovtArea.json'),

  genPlateNumber(localGovtName) {
    if(! plateNumber.localGovtAreas.hasOwnProperty(localGovtName)) {
      const names = Object.keys(plateNumber.localGovtAreas);
      localGovtName = names[plateNumber.genRandomNumber(0, names.length - 1)];
    }

    return plateNumber.localGovtAreas[toUpperCase(localGovtName)] +  '-' + plateNumber.genRandomNumber(0, 999) + plateNumber.genlastTwoLetters();
  },
  genRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  genlastTwoLetters() {
    let text = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < 2; i++) {
      text += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return text;
  }
};

module.exports = plateNumber;

