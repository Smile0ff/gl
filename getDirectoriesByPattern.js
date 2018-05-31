const { readdirSync, statSync } = require('fs');
const { resolve, join, basename } = require('path');

const flatten = list => list.reduce((a, b) => a.concat(b), []);
const isDirectory = path => statSync(path).isDirectory();

const getDirectories = src =>
  readdirSync(src).map(file => join(src, file)).filter(isDirectory);

const getDirectoriesRecursive = src =>
  [src, ...flatten(getDirectories(src).map(getDirectoriesRecursive))];

const getDirectoriesByPattern = (basePath = '', pattern = 'i18n') => {
  return getDirectoriesRecursive(resolve('.', basePath)).filter(dir => basename(dir) === pattern);
};

module.exports = getDirectoriesByPattern;
