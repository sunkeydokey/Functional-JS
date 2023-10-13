const _ = require('underscore');

let result;

// 4.1.1
const people = [
  { name: 'Fred', age: 65 },
  { name: 'Amy', age: 75 },
  { name: 'Lucy', age: 36 },
  { name: 'Jack', age: 56 },
];

result = _.max(people, function (p) {
  return p.age;
});

console.log(result); // => { name: 'Amy', age: 75 }

function finder(standardFun, collection) {
  return collection.reduce(function (best, current) {
    return best === standardFun(best, current) ? best : current;
  });
}
result = finder(Math.max, [1, 2, 3, 4, 5, 6, 7]);
console.log(result); // => 7
result = finder(Math.min, [1, 2, 3, 4, 5, 6, 7]);
console.log(result); // => 1

function getOlder(a, b) {
  return a.age >= b.age ? a : b;
}
result = finder(getOlder, people);
console.log(result); // => { name: 'Amy', age: 75 }

function newFinder(standardFun) {
  return function (collection) {
    return finder(standardFun, collection);
  };
}

const getOldest = newFinder(getOlder);
result = getOldest(people);
console.log(result); // => { name: 'Amy', age: 75 }

function best(fun, collection) {
  return collection.reduce(function (x, y) {
    return fun(x, y) ? x : y;
  });
}

result = best(
  function (x, y) {
    return x > y;
  },
  [1, 2, 3, 4, 5]
);

console.log(result); // => 5

// 4.1.2

function repeat(times, value) {
  const space = Array(times).fill(null);
  return space.map(() => value);
}

result = repeat(4, 'Major');
console.log(result); //=> [ 'Major', 'Major', 'Major', 'Major' ]

function repeatAction(times, actionFunc) {
  const space = Array(times).fill(null);
  return space.map(actionFunc);
}

result = repeatAction(4, function () {
  return Math.floor(Math.random() * 10 + 1);
});
console.log(result); //=> [ 5, 7, 2, 6 ]

function iterateUntil(fun, check, init) {
  var result = [];
  var value = fun(init);

  while (check(value)) {
    result.push(value);
    value = fun(value);
  }

  return result;
}

result = iterateUntil(
  function (n) {
    return n + n;
  },
  function (n) {
    return n <= 1024;
  },
  1
);
console.log(result); //=> [ 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 ]
