// Display management
let display = document.getElementById('display');
let history = document.getElementById('history');
let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeBasicCalculator();
    initializeScientificCalculator();
    initializeConverters();
    initializeGraph();
    initializeTabSwitching();
});

// Tab Switching
function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// ==================== BASIC CALCULATOR ====================
function initializeBasicCalculator() {
    const buttons = document.querySelectorAll('#basic .btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const btnText = button.textContent;
            
            if (button.id === 'clear') {
                clearDisplay();
            } else if (button.id === 'delete') {
                deleteLastChar();
            } else if (btnText === '=') {
                calculate();
            } else if (['+', '-', '*', '/', '%'].includes(btnText)) {
                handleOperator(btnText);
            } else {
                appendNumber(btnText);
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('basic').classList.contains('active')) {
            if (/\d/.test(e.key)) appendNumber(e.key);
            if (e.key === '.') appendNumber('.');
            if (['+', '-', '*', '/'].includes(e.key)) handleOperator(e.key);
            if (e.key === 'Enter') calculate();
            if (e.key === 'Backspace') deleteLastChar();
            if (e.key === 'Escape') clearDisplay();
        }
    });
}

function appendNumber(num) {
    if (shouldResetDisplay) {
        currentValue = num;
        shouldResetDisplay = false;
    } else {
        if (currentValue === '0' && num !== '.') {
            currentValue = num;
        } else if (num === '.' && currentValue.includes('.')) {
            return;
        } else {
            currentValue += num;
        }
    }
    updateDisplay();
}

function handleOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    previousValue = currentValue;
    operator = op;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    if (operator === null || shouldResetDisplay) return;

    let result;
    const prev = parseFloat(previousValue);
    const curr = parseFloat(currentValue);

    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            result = curr === 0 ? 'Error' : prev / curr;
            break;
        case '%':
            result = prev % curr;
            break;
        default:
            return;
    }

    history.textContent = `${previousValue} ${operator} ${currentValue}`;
    currentValue = result.toString();
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function deleteLastChar() {
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
    updateDisplay();
}

function clearDisplay() {
    currentValue = '0';
    previousValue = '';
    operator = null;
    shouldResetDisplay = false;
    history.textContent = '0';
    updateDisplay();
}

function updateDisplay() {
    display.value = currentValue;
}

// ==================== SCIENTIFIC CALCULATOR ====================
function initializeScientificCalculator() {
    const buttons = document.querySelectorAll('#scientific .btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const btnText = button.textContent;
            
            if (button.id === 'clear-sci') {
                clearDisplay();
            } else if (button.id === 'delete-sci') {
                deleteLastChar();
            } else if (button.classList.contains('sci-func')) {
                handleScientificFunction(btnText);
            } else if (btnText === '=') {
                calculate();
            } else if (['+', '-', '*', '/', '^'].includes(btnText)) {
                handleOperator(btnText === '^' ? '**' : btnText);
            } else {
                appendNumber(btnText);
            }
        });
    });
}

function handleScientificFunction(func) {
    const value = parseFloat(currentValue);
    let result;

    try {
        switch (func) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case '√':
                result = Math.sqrt(value);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'x²':
                result = value * value;
                break;
            case 'x³':
                result = value * value * value;
                break;
            case '1/x':
                result = 1 / value;
                break;
            case 'n!':
                result = factorial(Math.floor(value));
                break;
            case '|x|':
                result = Math.abs(value);
                break;
            case 'π':
                currentValue = Math.PI.toString();
                updateDisplay();
                return;
            case 'e':
                currentValue = Math.E.toString();
                updateDisplay();
                return;
            default:
                return;
        }

        history.textContent = `${func}(${value})`;
        currentValue = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
    } catch (error) {
        display.value = 'Error';
    }
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// ==================== UNIT CONVERTERS ====================
function initializeConverters() {
    // Temperature
    document.getElementById('celsius').addEventListener('input', (e) => {
        const celsius = parseFloat(e.target.value);
        if (!isNaN(celsius)) {
            document.getElementById('fahrenheit').value = ((celsius * 9/5) + 32).toFixed(2);
        }
    });

    document.getElementById('fahrenheit').addEventListener('input', (e) => {
        const fahrenheit = parseFloat(e.target.value);
        if (!isNaN(fahrenheit)) {
            document.getElementById('celsius').value = ((fahrenheit - 32) * 5/9).toFixed(2);
        }
    });

    // Length
    document.getElementById('meters').addEventListener('input', (e) => {
        const meters = parseFloat(e.target.value);
        if (!isNaN(meters)) {
            document.getElementById('feet').value = (meters * 3.28084).toFixed(4);
        }
    });

    document.getElementById('feet').addEventListener('input', (e) => {
        const feet = parseFloat(e.target.value);
        if (!isNaN(feet)) {
            document.getElementById('meters').value = (feet / 3.28084).toFixed(4);
        }
    });

    // Weight
    document.getElementById('kg').addEventListener('input', (e) => {
        const kg = parseFloat(e.target.value);
        if (!isNaN(kg)) {
            document.getElementById('lbs').value = (kg * 2.20462).toFixed(2);
        }
    });

    document.getElementById('lbs').addEventListener('input', (e) => {
        const lbs = parseFloat(e.target.value);
        if (!isNaN(lbs)) {
            document.getElementById('kg').value = (lbs / 2.20462).toFixed(2);
        }
    });

    // Reset button
    document.getElementById('reset-converter').addEventListener('click', () => {
        document.getElementById('celsius').value = '';
        document.getElementById('fahrenheit').value = '';
        document.getElementById('meters').value = '';
        document.getElementById('feet').value = '';
        document.getElementById('kg').value = '';
        document.getElementById('lbs').value = '';
    });
}

// ==================== GRAPH PLOTTER ====================
function initializeGraph() {
    document.getElementById('plot-graph').addEventListener('click', () => {
        const formula = document.getElementById('formula').value;
        if (formula) {
            plotGraph(formula);
        }
    });

    document.getElementById('formula').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const formula = document.getElementById('formula').value;
            if (formula) {
                plotGraph(formula);
            }
        }
    });
}

function plotGraph(formula) {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 40; // pixels per unit

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += scale) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
    for (let i = 0; i < height; i += scale) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Plot function
    try {
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();

        let firstPoint = true;
        for (let px = 0; px < width; px++) {
            const x = (px - centerX) / scale;
            const y = evaluateFormula(formula, x);
            
            if (typeof y === 'number' && isFinite(y)) {
                const py = centerY - y * scale;
                
                if (firstPoint) {
                    ctx.moveTo(px, py);
                    firstPoint = false;
                } else {
                    ctx.lineTo(px, py);
                }
            }
        }
        ctx.stroke();
    } catch (error) {
        ctx.fillStyle = '#ff6b6b';
        ctx.font = '14px Arial';
        ctx.fillText('Invalid formula', 20, 30);
    }
}

function evaluateFormula(formula, x) {
    try {
        // Safe evaluation with common math functions
        const mathFuncs = {
            sin: Math.sin,
            cos: Math.cos,
            tan: Math.tan,
            sqrt: Math.sqrt,
            log: Math.log10,
            ln: Math.log,
            abs: Math.abs,
            ceil: Math.ceil,
            floor: Math.floor,
            round: Math.round,
            PI: Math.PI,
            E: Math.E
        };

        let expr = formula
            .replace(/x/g, `(${x})`)
            .replace(/\^/g, '**');

        // Create function with allowed functions
        const func = new Function(...Object.keys(mathFuncs), `return ${expr}`);
        return func(...Object.values(mathFuncs));
    } catch (error) {
        return NaN;
    }
}
