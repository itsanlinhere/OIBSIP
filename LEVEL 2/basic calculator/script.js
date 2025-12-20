let display = document.getElementById('display');
let currentInput = '';
let previousInput = '';
let operation = null;

function updateDisplay() {
    display.textContent = currentInput || '0';
}

function clearCalculator() {
    currentInput = '';
    previousInput = '';
    operation = null;
    updateDisplay();
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function appendNumber(number) {
    if (currentInput.length < 12) { // Limit input length
        currentInput += number;
        updateDisplay();
    }
}

function appendDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

function setOperation(op) {
    if (currentInput === '' && previousInput !== '') {
        operation = op;
        return;
    }
    if (previousInput !== '') {
        calculate();
    }
    previousInput = currentInput;
    currentInput = '';
    operation = op;
}

function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero');
                clearCalculator();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    currentInput = result.toString();
    operation = null;
    previousInput = '';
    updateDisplay();
}

// Event listeners
document.getElementById('clear').addEventListener('click', clearCalculator);
document.getElementById('backspace').addEventListener('click', backspace);
document.getElementById('decimal').addEventListener('click', appendDecimal);
document.getElementById('equals').addEventListener('click', calculate);

document.getElementById('add').addEventListener('click', () => setOperation('+'));
document.getElementById('subtract').addEventListener('click', () => setOperation('-'));
document.getElementById('multiply').addEventListener('click', () => setOperation('*'));
document.getElementById('divide').addEventListener('click', () => setOperation('/'));

document.getElementById('zero').addEventListener('click', () => appendNumber('0'));
document.getElementById('one').addEventListener('click', () => appendNumber('1'));
document.getElementById('two').addEventListener('click', () => appendNumber('2'));
document.getElementById('three').addEventListener('click', () => appendNumber('3'));
document.getElementById('four').addEventListener('click', () => appendNumber('4'));
document.getElementById('five').addEventListener('click', () => appendNumber('5'));
document.getElementById('six').addEventListener('click', () => appendNumber('6'));
document.getElementById('seven').addEventListener('click', () => appendNumber('7'));
document.getElementById('eight').addEventListener('click', () => appendNumber('8'));
document.getElementById('nine').addEventListener('click', () => appendNumber('9'));

// Keyboard support
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendDecimal();
    } else if (event.key === '+') {
        setOperation('+');
    } else if (event.key === '-') {
        setOperation('-');
    } else if (event.key === '*') {
        setOperation('*');
    } else if (event.key === '/') {
        setOperation('/');
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        clearCalculator();
    } else if (event.key === 'Backspace') {
        backspace();
    }
});
