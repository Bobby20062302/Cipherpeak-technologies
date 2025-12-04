// state
let current = "0";     // number we are typing / showing
let previous = "";     // first number (before operator)
let operator = "";     // add | subtract | multiply | divide
let resetScreen = false; // when true, next number press starts a new number

// elements
const display = document.getElementById("display");
const history = document.getElementById("history");
const keys = document.querySelectorAll(".key");

// click handlers for every button
keys.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;

    if (action === "number") {
      handleNumber(btn.dataset.number);
    } else if (action === "decimal") {
      handleDecimal();
    } else if (action === "operator") {
      handleOperator(btn.dataset.operator);
    } else if (action === "equals") {
      handleEquals();
    } else if (action === "clear") {
      clearAll();
    } else if (action === "delete") {
      deleteLast();
    } else if (action === "sign") {
      toggleSign();
    }

    updateDisplay();
  });
});

function handleNumber(num) {
  if (current === "0" || resetScreen) {
    current = num;
    resetScreen = false;
  } else {
    current += num;
  }
}

function handleDecimal() {
  if (resetScreen) {
    current = "0.";
    resetScreen = false;
    return;
  }
  if (!current.includes(".")) {
    current += ".";
  }
}

function handleOperator(nextOperator) {
  if (previous !== "" && operator !== "" && !resetScreen) {
    // if we already have an operation waiting, finish it first
    compute();
  }

  previous = current;
  operator = nextOperator; // "add", "subtract", "multiply", "divide"
  resetScreen = true;
  updateHistoryPartial();
}

function handleEquals() {
  if (previous === "" || operator === "") {
    return;
  }
  compute(true);
}

// actually do the math
function compute(showFullExpression) {
  const a = parseFloat(previous);
  const bStr = current;           // keep string for history
  const b = parseFloat(bStr);
  let result;

  if (operator === "add") {
    result = a + b;
  } else if (operator === "subtract") {
    result = a - b;
  } else if (operator === "multiply") {
    result = a * b;
  } else if (operator === "divide") {
    if (b === 0) {
      current = "Error";
      history.textContent = "";
      previous = "";
      operator = "";
      resetScreen = true;
      return;
    }
    result = a / b;
  }

  current = result.toString();

  if (showFullExpression) {
    history.textContent = "(" + previous + " " + getOpSymbol(operator) + " " + bStr + ")";
  }

  previous = "";
  operator = "";
  resetScreen = true;
}

// little helper: which symbol to show
function getOpSymbol(op) {
  if (op === "add") return "+";
  if (op === "subtract") return "-";
  if (op === "multiply") return "×";
  if (op === "divide") return "÷";
  return "";
}

// update history when only first number + operator are known
function updateHistoryPartial() {
  if (previous === "" || operator === "") {
    history.textContent = "";
    return;
  }
  history.textContent = "(" + previous + " " + getOpSymbol(operator);
}

function clearAll() {
  current = "0";
  previous = "";
  operator = "";
  resetScreen = false;
  history.textContent = "";
}

function deleteLast() {
  if (resetScreen) {
    // if we just finished a calculation, delete behaves like clear
    clearAll();
    return;
  }
  if (current.length > 1) {
    current = current.slice(0, -1);
  } else {
    current = "0";
  }
}

function toggleSign() {
  if (current === "0") return;
  if (current.startsWith("-")) {
    current = current.slice(1);
  } else {
    current = "-" + current;
  }
}

function updateDisplay() {
  display.textContent = current;
}