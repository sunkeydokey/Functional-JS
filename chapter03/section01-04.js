// 전역 스코프
const globalVariable = '글로벌 변수';
console.log(
  Array(2)
    .fill(null)
    .map(() => globalVariable)
);
// => [ '글로벌 변수', '글로벌 변수' ]

const globalObject = {};
(function someFunc() {
  const copiedGlobalObject = globalObject;
  copiedGlobalObject.touched = true;
})();
console.log(globalObject);
// => { touched: true }

// 어휘 스코프
const variable = '전역 변수';

function wrapper() {
  const variable = 'wrapper 함수 내부 변수';

  return Array(2)
    .fill(null)
    .map(() => {
      const variable = 'map 함수 내부 변수';
      return variable;
    });
}

console.log(wrapper());
// => [ 'map 함수 내부 변수', 'map 함수 내부 변수' ]

// 동적 스코프
const globals = {};

function makeBindFunc(resolverFunc) {
  return function (k, v) {
    const stack = globals[k] || [];
    globals[k] = resolverFunc(stack, v);
    return globals[k];
  };
}

const stackBinder = makeBindFunc(function (stack, v) {
  stack.push(v);
  return stack;
});
// 키와 값을 받아서 키와 관련된 슬롯에 있는 전역 바인딩 맵에 값을 추가

const stackUnBinder = makeBindFunc(function (stack, v) {
  stack.pop();
  return stack;
});
// 키를 받아서 키와 관련된 슬롯에 있는 전역 바인딩 맵의 마지막 값을 제거

const dynamicLookup = function (k) {
  const slot = globals[k] || [];
  return slot.at(-1);
};
// 마지막으로 바인딩된 값을 탐색

stackBinder('firstVariable', 1);
stackBinder('firstVariable', 3);
stackBinder('secondVariable', 30);

console.log(dynamicLookup('firstVariable')); // => 3
console.log(dynamicLookup('secondVariable')); // => 30
console.log(globals); // => { firstVariable: [ 1, 3 ], secondVariable: [ 30 ] }

function f() {
  return dynamicLookup('firstVariable');
}

function g() {
  stackBinder('firstVariable', 'g');
  return f();
}
console.log(f()); // => 3
console.log(g()); // => 'g'

console.log(globals); // => { firstVariable: [ 1, 3, 'g' ], secondVariable: [ 30 ] }

// this
function globalThis() {
  return this;
}
console.log(globalThis()); // => node의 global객체
console.log(globalThis.call('new this')); // => [String: 'new this']
console.log(globalThis.apply('new new this')); // [String: 'new new this']

const boundGlobalThis = globalThis.bind('bind');
console.log(boundGlobalThis()); // => [String: 'bind']
console.log(boundGlobalThis.apply('new new this')); // [String: 'bind']
