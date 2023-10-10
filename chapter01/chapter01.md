# 함수형 자바스크립트 소개

## 1.1 자바스크립트 활용 사례

- 자바스크립트는 함수부터 클로저, 프로토타입 등의 도구 집합을 제공함
- 자바스크립트의 함수에는 인자의 개수와 형식에 제한이 없는 등 유연한 특징을 가지고 있음
- 자바스크립트는 훈련하고 정해진 규칙을 준수한다면 안전하고 이해와 테스트가 쉬운 언어이며, 코드 베이스의 크기를 비례적으로 확장할 수 있는 기능까지 갖추고 있음

## 1.2 함수형 프로그래밍 시작하기

함수형 프로그래밍은 다음과 같이 설명할 수 있음

> 값을 추상화의 단위로 바꾸는 기능을 하며 결국 바뀐 값들로 소프트웨어 시스템을 구성한다,

### 1.2.1 OOP와의 비교

- FP와 OOP가 극과 극의 적대적인 패러다임이 아님
- 자바스크립트는 두 가지 패러다임을 모두 지원하기에 시스템을 제대로 구성하려면 두 패러다임을 적절히 사용해야 함

#### OOP

- 객체 간의 상호작용이 발생하면 각 객체의 내부 값이 바뀌면서 전체 시스템의 상태가 바뀌는데 이때 잠재적으로 미묘한 변화가 일어날 수 있음
- 서로 영향을 주는 상태 변화가 개념적으로 `웹 변화` 를 일으키게 됨
- 작은 변경으로 큰 상태 변화가 발생할 수 있는 상황에서 새 객체를 추가하거나 새로운 시스템 기능을 추가해야 할 때 어려움을 겪을 수 있음

#### FP

- 관찰할 수 있는 상태 변화를 최소화하려 함
- 새로운 기능을 추가할 때 새로운 함수가 지역화되고 비파괴적인 데이터 전이 과정에서 어떻게 동작할 것인지를 파악하는 것이 핵심

> 실용적인 함수형 프로그래밍은 어떤 시스템에서 상태 변화를 완전히 제거하는 것이 아니라 변이의 발생 지역을 가능한 최소화하는 것을 목표로 한다.

### 1.2.2 함수 - 추상화 단위

함수는 뷰에서 상세 구현을 숨김으로써 추상화를 달성할 수 있음

숫자로 된 문자열을 받아 숫자형으로 처리해 나이를 반환하는 함수에서 에러와 경고를 처리할 때 다음과 같이 구현할 수 있다.

```js
const _ = require('underscore');

let result;

function parseAge(age) {
  if (!_.isString(age)) throw new Error('문자열로 입력해주세요.');
  let result;

  console.log('입력된 나이를 처리');

  result = parseInt(age, 10);

  if (_.isNaN(result)) {
    console.log(`입력된 ${age}는 숫자가 아닙니다.`);
    result = 0;
  }

  return result;
}

result = parseAge('10');
console.log(result);
// 입력된 나이를 처리
// 10

result = parseAge(42);
console.log(result);
// Error: 문자열로 입력해주세요.

result = parseAge('not age');
console.log(result);
// 입력된 나이를 처리
// 입력된 not age는 숫자가 아닙니다.
// 0
```

그러나 함수형 프로그래밍에서는 에러, 경고, 정보의 개념을 활용해서 '추상화'하는 것이 더 바람직함

```js
const _ = require('underscore');

let result;

function noticeFail(message) {
  throw new Error(message);
}
function noticeWarning(message) {
  console.log('WARNING:', message);
}
function noticeProgress(message) {
  console.log('PROGRESS:', message);
}

function refactoredParseAge(age) {
  if (!_.isString(age)) noticeFail('문자열로 입력해주세요.');

  let result;

  noticeProgress('입력된 나이를 처리');

  result = parseInt(age, 10);

  if (_.isNaN(result)) {
    noticeWarning(`입력된 ${age}는 숫자가 아닙니다.`);
    result = 0;
  }

  return result;
}

result = refactoredParseAge('10');
console.log(result);
// PROGRESS: 입력된 나이를 처리
// 10
```

에러, 경고, 정보 출력이 추상화된 것 말고는 크게 달라진 점이 없으나, 이제부터는 원하는 대로 이들의 출력 방식을 원하는 대로 쉽게 변경할 수 있다.

### 1.2.3 캡슐화와 은닉

- 객체지향에서의 캡슐화란 일련의 정보와 그 정보를 조작할 수 있는 동작을 묶는 것을 가리킴
- 자바스크립트는 데이터와 관련 동작을 묶을 수 있는 객체 시스템을 제공
- 때로는 특정 요소를 감추기 캡슐화를 사용하기도 하는데 이를 데이터 은닉이라 함
- 자바스크립트의 객체 시스템에서는 데이터 은닉을 직접적으로 지원하지 않기에 클로저를 이용함
- 함수형 방식에서는 클로저를 이용해 대부분의 객체지향 언어에서 지원하는 데이터 은닉을 수행함

### 1.2.4 함수 - 동작 단위

ex. 배열 인덱싱은 기본 동작이므로 따로 함수를 만들지 않고는 동작을 수정할 수 없다. 인덱싱 동작을 추상화하는 함수는 다음과 같다.

```js
const letters = ['a', 'b', 'c', 'd', 'e', 'f'];

function naiveNth(array, index) {
  return array[index];
}

result = naiveNth(letters, 2);
console.log(result);
// => c
```

그러나 array 매개변수에 인덱싱이 되지 않는 타입의 데이터를 인자로 넣으면 함수가 의도와 다르게 동작한다.

```js
result = naiveNth({}, 2);
console.log(result);
// => undefined
```

따라서 인덱싱이 되는 타입의 데이터인지 판단하는 함수를 추상화하여 예외나 오류를 처리할 수 있다.

```js
function isIndexed(data) {
  return _.isArray(data) || _.isString(data);
}

function refactoredNth(array, index) {
  if (!_.isNumber(index)) noticeFail('Index는 숫자여야 합니다.');
  if (!isIndexed(array)) noticeFail('인덱싱이 가능한 데이터를 입력해주세요.');
  if (index < 0 || index >= array.length)
    noticeFail('Index의 범위에 포함된 값을 입력해주세요.');

  return array[index];
}

result = refactoredNth(letters, 3);
console.log(result);
// => d

result = refactoredNth(letters, 'NaN');
console.log(result);
// => Error: Index는 숫자여야 합니다.

result = refactoredNth(letters, -1);
console.log(result);
// => Error: Index의 범위에 포함된 값을 입력해주세요.

result = refactoredNth({}, -1);
console.log(result);
// => Error: 인덱싱이 가능한 데이터를 입력해주세요.
```

### 1.2.5 데이터 추상화

- 클래스 시스템 기반의 프로그래밍도 장점이 있지만 굳이 클래스로 데이터를 제공하지 않아도 될만큼 단순하게 데이터를 처리하는 것이 바람직할 때가 있음
- 함수형 프로그래밍은 고수준의 동작을 달성하는 함수의 핵심이었으며 매우 간단한 데이터 구조를 다루는 데 특화되어 있음
- 하나의 데이터를 함수를 매개로 다른 형태의 데이터로 변환하는 것이 핵심
- 필자의 첨언으로는 경험상 일반적인 컬렉션 처리 함수와 관련된 함수형 접근 방식은 데이터를 처리하는 데 효율적이고 객체 지향 방식은 시뮬레이션에 더 적합하다고 함

### 함수형 자바스크립트 맛보기

- 함수 형태로 존재의 추상화를 정의한다.

```js
function exist(value) {
  return x != null;
}
// 값의 존재여부를 판단할 수 있음
```

- 기존 함수를 이용해서 참거짓의 추상화를 정의한다.

```js
function truthy(value) {
  return value !== false && exist(value);
}
```

- 위 함수를 다른 함수의 파라미터로 제공해서 어떤 동작을 하도록 한다.

```js
[null, undefined, true, true, false].map(truthy);
// => [false, false, true, true, false]
```

## 요약

함수형 프로그래밍의 특징

- 추상화를 식별해서 함수로 만든다.
- 기존 함수를 이용해서 더 복잡한 추상화를 만든다.
- 기존 함수를 다른 함수에 제공해서 더 복잡한 추상화를 만든다.
