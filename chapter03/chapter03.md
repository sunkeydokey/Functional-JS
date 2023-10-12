# 3. 변수 스코프와 클로저

1. 스코프
2. 바인딩 및 클로저
3. 클로저가 동작하는 방법 및 사용 사례

## 3.1 ~ 3.4 스코프

스코프는 변수의 생명주기와 깊은 관련이 있다.

### 전역 스코프

전역 변수는 프로그램과 생명주기를 같이 한다.

```js
const globalVariable = '글로벌 변수';
console.log(
  Array(2)
    .fill(null)
    .map(() => globalVariable)
);
// => [ '글로벌 변수', '글로벌 변수' ]
```

> 책에서는 자바스크립트의 변수는 불변성을 가질 수 없다고 하지만 ES6부터 `const` 가 추가되어 현재에는 맞지 않다.
> 따라서 전역 변수의 약점을 언급하는 내용은 생략한다.

```js
const globalObject = {};
(function someFunc() {
  const copiedGlobalObject = globalObject;
  copiedGlobalObject.touched = true;
})();
console.log(globalObject);
```

> 다만 const 로 선언한 변수라도 참조형의 값을 할당했다면 언제든 객체를 조작할 수 있어 오류가능성을 염두하자.

### 어휘 스코프

어휘 스코프란 변수와 값의 유효 범위를 가리킨다.

```js
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
```

map 이 호출될 때 variable의 값은 가장 가까운 스코프에 있는 `map 함수 내부 변수`가 된다.  
자바스크립트는 가장 가까운 스코프에서부터 바인딩을 찾을 때까지 외부로 변수 탐색을 하는 스코프 체인을 가지고 있다.

### 동적 스코프

#### 간단한 동적 스코핑 예시

```js
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
```

다만 이러한 방식에는 취약점이 있다.

```js
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
```

함수 f는 첫 번 째 변수의 바인딩에 영향을 주지 않지만 f를 호출하는 g는 첫 번 째 변수의 바인딩 스택에 영향을 준다.  
어떠한 함수를 호출한 함수의 정체를 알아야 주어진 변수의 바인딩 값을 알 수 있다는 것은 동적 스코핑의 약점이다.  
보통의 동적 바인딩을 지원하는 프로그래밍 언어에서는 동적 바인딩 컨텍스트가 종료될 때 언바인딩 작업이 자동으로 처리된다.

#### this

this는 자신이 생성된 환경과 다른 컨텍스트에서 다른 값을 가질 수 있다. 이전의 g 함수와 마찬가지로 호출자에 따라 혹은 apply, call 메서드처럼 호출하는 상황에 따라 this의 값이 결정된다.

```js
function globalThis() {
  return this;
}
console.log(globalThis()); // => node의 global객체
console.log(globalThis.call('new this')); // => [String: 'new this']
console.log(globalThis.apply('new new this')); // [String: 'new new this']
```

```js
const boundGlobalThis = globalThis.bind('bind');
console.log(boundGlobalThis()); // => [String: 'bind']
console.log(boundGlobalThis.apply('new new this')); // [String: 'bind']
```

function의 bind 메서드를 통해 this를 고정할 수도 있다. (책에서는 underscore의 bind 메서드 사용)

### 함수 스코프

> 블록 스코프 규격 명세의 도입 준비 중인 시기에 작성된 내용으로 생략함

## 3.5 클로저

클로저는 `근처에서 만들어진 변수를 캡처하는 함수`다. 자바스크립트는 일급함수를 지원하므로 클로저를 이용하여 상태를 캡슐화, 은닉화할 수 있다.

> [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures)에서는 `클로저는 주변 상태(어휘적 환경)에 대한 참조와 함께 묶인(포함된) 함수의 조합`이라 설명한다.

```js
function getLocalVariable() {
  const LOCAL_VARIABLE = 'local variable';
  return function () {
    return LOCAL_VARIABLE;
  };
}

const localVariable = getLocalVariable();
console.log(localVariable()); // => local variable

function storeMessage(message) {
  return function (n) {
    return message.repeat(n);
  };
}

const NTimesOfMessage = storeMessage('message! ');
console.log(NTimesOfMessage(3)); // => message! message! message!
```

### 클로저를 이용한 간단한 추상화

```js
const someProfile = {
  name: 'sun',
  phone: '010-0000-9999',
  age: 27,
};
function checkProperty(property) {
  return function (obj) {
    return obj && obj[property];
  };
}

const getPhone = checkProperty('phone');

console.log(getPhone(someProfile)); // => 010-0000-9999
```

키값 혹은 인덱스를 받아 주어진 객체 혹은 배열에서 키, 인덱스에 해당하는 값을 반환하는 함수 checkProperty가 있다. 이 함수에 넣은 값에 따라 변수를 의미있게 작성하면 간단하게 추상화를 할 수 있다.

## 3.6 요약

- apply, call 등의 메서드를 통해 함수의 this 에 영향을 줄 수 있다.
- bind 를 통해 함수의 this를 원하는 값으로 고정할 수 있다.
- 클로저를 이용해 기존 함수에서 새로운 추상화를 만들어낼 수 있다.
