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

// result = parseAge('10');
// console.log(result);
// // 입력된 나이를 처리
// // 10

// result = parseAge(42);
// console.log(result);
// // Error: 문자열로 입력해주세요.

// result = parseAge('not age');
// console.log(result);
// // 입력된 나이를 처리
// // 입력된 not age는 숫자가 아닙니다.
// // 0

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

// result = refactoredParseAge('10');
// console.log(result);
// // PROGRESS: 입력된 나이를 처리
// // 10

const letters = ['a', 'b', 'c', 'd', 'e', 'f'];

function naiveNth(array, index) {
  return array[index];
}

result = naiveNth(letters, 2);
console.log(result);
// => c

result = naiveNth({}, 2);
console.log(result);
// => undefined

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
