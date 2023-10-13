# 4. 고차 함수

- 고차 함수는 일급이다.
- 고차함수는 함수를 인자로 받는다.
- 고차함수는 함수를 결과로 반환한다.

이 중 함수를 인자로 취하는 특징은 FP 패러다임과 매우 크게 연관되어 있는 기능이다.

## 4.1 다른 함수를 인자로 취하는 함수

map, filter, reduce 등의 함수와 같은 유명한 함수들은 함수를 인자로 받는 고차 함수다. 이 장에서는 별개로 다른 함수를 취하는 함수에 클로저 개념을 묶어 함수형 프로그래밍을 더 자세히 살펴보려 한다.

### 4.1.1 함수 전달에 대한 고찰

```js
let result;

const people = [
  { name: 'Fred', age: 65 },
  { name: 'Lucy', age: 36 },
];

result = _.max(people, function (p) {
  return p.age;
});

console.log(result); // => {name: "Fred", age: 65}
```

언더스코어 라이브러리의 max함수는 두번째 인자로 함수를 받아 최대값 기준을 설정할 수 있다. 다만 오로지 > 연산을 통해서만 비교한다는 제한이 있다.

```js
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
```

인자로 기준에 따라 적절한 값을 반환하는 함수를 인자로 취하는 함수 finder를 선언했다. 이 함수를 통해 내가 원하는 기준에 따라 유연하게 finder를 사용할 수 있다.

#### Aha Moment

> 개인적으로 이 예제에서 저자가 maxFinder가 아닌 finder로 함수명을 설정했는지, 언더스코어의 max 메서드가 아닌 Math.max 메서드를 사용했는지 고민하면서 함수형 프로그래밍에 대한 이해도가 상승했다 느꼈다.
> finder라는 공용의 고차함수를 정의하면서 프로그래머가 원하는 기준에 따라 유연하게 최적의 값을 찾는 재사용 가능한 여러 finder를 만들어 낼 수 있다.
> 이 이해를 통해 다음과 같은 응용도 가능해진다.

```js
function newFinder(standardFun) {
  return function (collection) {
    return finder(standardFun, collection);
  };
}

const getOldest = newFinder(getOlder);
result = getOldest(people);
console.log(result); // => { name: 'Amy', age: 75 }
```

standardFun에 할당된 함수를 클로저로 두게 하는 newFinder함수를 정의했다. newFinder에 기준을 넣어주고 변수에 추상화를 하면 원할 때마다 원하는 collection을 할당해 값을 얻을 수 있다. 반대의 순서 함수를 수정한다면 collection을 먼저 받아 추후에 데이터에서 원하는 기준에 의해 최적값을 받는 방식 또한 가능해질 것이다.

### 4.1.2 값 대신 함수를 사용하기

```js
function repeat(times, value) {
  const space = Array(times).fill(null);
  return space.map(() => value);
}

result = repeat(4, 'Major');
console.log(result); //=> [ 'Major', 'Major', 'Major', 'Major' ]
```

repeat 함수는 원하는 값을 N번 배열 요소로 반환한다. 충분히 괜찮은 함수이지만 두 가지 약점이 있다.

1. 일반성과 반복성이 없다. 단순히 값만을 N회 배열요소로 저장할 뿐이다.
2. times에 넣어야할 값을 프로그래머가 정확하게 알아야 하므로 유연함이 없다.

```js
function repeatAction(times, actionFunc) {
  const space = Array(times).fill(null);
  return space.map(actionFunc);
}

result = repeatAction(4, function () {
  return Math.floor(Math.random() * 10 + 1);
});
console.log(result); //=> [ 5, 7, 2, 6 ]
```

값 대신 함수를 인자로 취하게 하여 동작의 결과값을 배열 요소로 저장하게 해주었다. 값을 고정할 필요가 없고 원하는 동작에 따라 배열을 채울 수 있다.

```jsx
repeatAction(5, function (_, i) {
  return <SomeListItemComponent key={i} />;
});
```

> 위 함수를 통해 정해진 수만큼의 리액트DOM을 생성할 수도 있다. (index를 key로 넣는 부분은 무시하자)

repeatAction 함수로 1번의 약점을 해결할 수 있었다. 다만 for문과 while문의 사용처가 다르듯이 반복 횟수가 미정인 경우 혹은 조건에 따라 종료해야 하는 경우에는 사용하기 어렵다는 약점이 아직 남아있다.

```js
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
```

종료 조건 또한 함수의 반환값을 통해 정해지도록 하는 iterateUntil를 정의했다. 반복 횟수를 정하지 않아도 함수가 종료조건에 따라 반복을 종료하게 되어 2번 약점을 해결할 수 있다.

## 4.2 다른 함수를 반환하는 함수

```js
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
```

인자에 할당된 매개변수를 캡처하는 always 함수가 있다. 이 함수를 통해 클로저에 관한 두 가지 중요한 규칙을 찾을 수 있다.

1. 클로저는 한 개의 값이나 레퍼런스를 캡처한 다음 항상 같은 값을 반환한다.
2. 새로운 클로저는 생성될 때마다 매번 다른 값을 캡처한다.

## 요약

- 함수에 값을 넘겨줌으로써 원하는 동작을 구현할 수 있다. 값 대신에 함수를 전달하면 더 일반화시킬 수 있다.
- 클로저 및 고차함수를 이용해 시스템을 효율적으로 구현할 수 있다.
