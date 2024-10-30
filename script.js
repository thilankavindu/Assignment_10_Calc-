const display = $("#display");
let currentInput = "";
let previousInput = "";
let operation = null;
let shouldResetDisplay = false;

function updateDisplay() {
    display.val(currentInput);
}

function calculate() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            return prev + current;
        case '-':
            return prev - current;
        case '×':
            return prev * current;
        case '÷':
            return current !== 0 ? prev / current : "Error";
        default:
            return current;
    }
}

function handleNumber(value) {
    if (shouldResetDisplay) {
        currentInput = value;
        shouldResetDisplay = false;
    } else {
        currentInput = currentInput === "0" ? value : currentInput + value;
    }
}

function handleDecimal() {
    if (shouldResetDisplay) {
        currentInput = "0.";
        shouldResetDisplay = false;
    } else if (!currentInput.includes(".")) {
        currentInput = currentInput === "" ? "0." : currentInput + ".";
    }
}

function handleOperator(value) {
    const currentValue = parseFloat(currentInput);

    if (operation && !shouldResetDisplay) {
        const result = calculate();
        if (result === "Error") {
            handleClear();
            currentInput = "Error";
            return;
        }
        currentInput = String(result);
    }

    previousInput = currentInput;
    operation = value;
    shouldResetDisplay = true;
}

function handleEquals() {
    if (!operation) return;

    const result = calculate();
    if (result === "Error") {
        handleClear();
        currentInput = "Error";
        return;
    }

    currentInput = String(result);
    previousInput = "";
    operation = null;
    shouldResetDisplay = true;
}

function handlePercentage() {
    const value = parseFloat(currentInput);
    if (!isNaN(value)) {
        currentInput = String(value / 100);
    }
}

function handleSquareRoot() {
    const value = parseFloat(currentInput);
    if (!isNaN(value) && value >= 0) {
        currentInput = String(Math.sqrt(value));
    } else {
        currentInput = "Error";
    }
}

function handleBackspace() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === "") currentInput = "0";
    }
}

function handleClear() {
    currentInput = "";
    previousInput = "";
    operation = null;
    shouldResetDisplay = false;
}

function handleInput(value) {
    if (currentInput === "Error" && value !== "C") {
        return;
    }

    if (/[0-9]/.test(value)) {
        handleNumber(value);
    } else {
        switch (value) {
            case '.':
                handleDecimal();
                break;
            case '+':
            case '-':
            case '×':
            case '÷':
                handleOperator(value);
                break;
            case '=':
                handleEquals();
                break;
            case '%':
                handlePercentage();
                break;
            case '√':
                handleSquareRoot();
                break;
            case '⌫':
                handleBackspace();
                break;
            case 'C':
                handleClear();
                break;
        }
    }
    updateDisplay();
}

$("button").on('click', function() {
    handleInput($(this).val());
});

$(document).on('keydown', function(event) {
    const key = event.key;

    const keyMappings = {
        'Enter': '=',
        'Escape': 'C',
        '/': '÷',
        '*': '×',
        'Backspace': '⌫',
        'r': '√',
        'p': '%'
    };

    if (/[0-9.]/.test(key)) {
        handleInput(key);
    } else if (['+', '-'].includes(key)) {
        handleInput(key);
    } else if (key in keyMappings) {
        handleInput(keyMappings[key]);
    }
});
