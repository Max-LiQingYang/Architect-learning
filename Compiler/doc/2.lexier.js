/**
 * 分词
 * 状态机
 */
const NUMBERS = /[0-9]/;
const Number = 'Number';
const Punctuator = 'Punctuator';
let tokens = [];

let currentToken = {};
/**
 * start 表示开始状态函数，返回下一个状态函数
 * @param {string} char 
 */
function start(char) {
    if (NUMBERS.test(char)) {
        currentToken.type = Number;
        currentToken.value = char;
        return number;
    } else {
        return start
    }
}

/**
 * 创建一个新 token
 * @param {object} token 
 */
function emit(token) {
    tokens.push(token);
}

function number(char) {
    if (NUMBERS.test(char)) {
        currentToken.value += char;
        return number;
    } else if (char === '+' || char === '-') {
        emit(currentToken);
        currentToken = { type: Punctuator, value: char }
        emit(currentToken);
        currentToken = { type: Number, value: ''}
        return number;
    } else {
        return number;
    }
}

function tokenizer(input) {
    let state = start;

    for (let char of input) {
        state = state(char);
    }

    if (currentToken.value && currentToken.value.length > 0) {
        emit(currentToken);
    }
}

tokenizer("10 + 20 + 30");

// 10 + 20 + 30
console.log(tokens);
