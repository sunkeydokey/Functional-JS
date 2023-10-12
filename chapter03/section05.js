// 클로저
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
