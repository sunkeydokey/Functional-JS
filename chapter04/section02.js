function always(value) {
  return function () {
    return value;
  };
}

const f = always(function () {});
console.log(f() === f()); // => true
const g = always(function () {});
console.log(f() === g()); // => false

const obj = always({});
const obje = always({});
console.log(obj === obj); // => true
console.log({} === {}); // => false
console.log(obj === {}); // => false
console.log(obj === obje); // => false
