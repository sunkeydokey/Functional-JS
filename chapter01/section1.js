const _ = require('underscore');

let result;

function splat(func) {
  return function (array) {
    return func.apply(null, array);
  };
}

const addArrayElement = splat(function (x, y) {
  return x + y;
});

result = addArrayElement([1, 2]);
console.log(result);
// => 3

function unsplat(func) {
  return function () {
    return func.call(null, _.toArray(arguments));
  };
}

const joinElements = unsplat(function (array) {
  return array.join(' ');
});

result = joinElements('a', 'b', 'c');
console.log(result);
// => a b c
