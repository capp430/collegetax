const incomeInput = document.getElementById("income");
const withheldInput = document.getElementById("withheld");
const selfInput = document.getElementById("self");
const stateInput = document.getElementById("state");
const statusInput = document.getElementById("status");

const resultCard = document.getElementById("resultCard");
const refundAmount = document.getElementById("refundAmount");
const stateNotice = document.getElementById("stateNotice");

const deductionRow = document.getElementById("deductionRow");
const taxableRow = document.getElementById("taxableRow");
const taxRow = document.getElementById("taxRow");
const seTaxRow = document.getElementById("seTaxRow");
const withholdingRow = document.getElementById("withholdingRow");

const progressBar = document.getElementById("progressBar");
const breakdownPanel = document.getElementById("breakdownPanel");
const toggleBreakdown = document.getElementById("toggleBreakdown");

/* ============================
   2025 STANDARD DEDUCTIONS
============================ */
const deductions2025 = {
  single: 15000,
  married: 30000,
  hoh: 22500
};

/* ============================
   2025 BRACKETS
============================ */
const brackets2025 = {
  single: [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ],
  married: [
    { limit: 23850, rate: 0.10 },
    { limit: 96950, rate: 0.12 },
    { limit: 206700, rate: 0.22 },
    { limit: 394600, rate: 0.24 },
    { limit: 501050, rate: 0.32 },
    { limit: 751600, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ],
  hoh: [
    { limit: 17000, rate: 0.10 },
    { limit: 64850, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250500, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ]
};

function calculate() {

  let income = parseFloat(incomeInput.value) || 0;
  let withheld = parseFloat(withheldInput.value) || 0;
  let selfIncome = parseFloat(selfInput.value) || 0;
  let status = statusInput.value;

  let totalIncome = income + selfIncome;

  updateProgress(income, withheld);

  if (totalIncome === 0) {
    resultCard.className = "result-box info";
    resultCard.textContent = "Enter income to begin calculation.";
    refundAmount.textContent = "";
    return;
  }

  const standardDeduction = deductions2025[status];
  let taxableIncome = Math.max(0, totalIncome - standardDeduction);

  let federalTax = calculateBrackets(taxableIncome, brackets2025[status]);
  let seTax = selfIncome * 0.153;
  let totalTax = federalTax + seTax;

  let balance = withheld - totalTax;

  updateBreakdown(standardDeduction, taxableIncome, federalTax, seTax, withheld);
  updateStateNotice();
  updateResult(balance, totalIncome, standardDeduction);
}

function calculateBrackets(income, brackets) {
  let tax = 0;
  let previousLimit = 0;

  for (let i = 0; i < brackets.length; i++) {
    let bracket = brackets[i];
    let taxableAtThisRate = Math.min(income, bracket.limit) - previousLimit;

    if (taxableAtThisRate > 0) {
      tax += taxableAtThisRate * bracket.rate;
      previousLimit = bracket.limit;
    } else {
      break;
    }
  }

  return tax;
}

function updateProgress(income, withheld) {
  let percent = 0;
  if (income > 0) percent += 50;
  if (withheld > 0) percent += 50;
  progressBar.style.width = percent + "%";
}

function updateBreakdown(deduction, taxable, tax, seTax, withheld) {
  deductionRow.textContent = "$" + deduction.toLocaleString();
  taxableRow.textContent = "$" + taxable.toLocaleString();
  taxRow.textContent = "$" + tax.toFixed(2);
  seTaxRow.textContent = "$" + seTax.toFixed(2);
  withholdingRow.textContent = "$" + withheld.toLocaleString();
}

function updateStateNotice() {
  if (stateInput.value === "tax") {
    stateNotice.textContent = "Your state may require additional filing.";
  } else {
    stateNotice.textContent = "Your state does not have income tax.";
  }
}

function updateResult(balance, totalIncome, threshold) {

  if (totalIncome < threshold) {
    resultCard.className = "result-box info show";
    resultCard.textContent = "Filing may not be required based on income.";
  } else if (balance >= 0) {
    resultCard.className = "result-box success show";
    resultCard.textContent = "You may receive a refund.";
  } else {
    resultCard.className = "result-box warning show";
    resultCard.textContent = "You may owe additional tax.";
  }

  animateNumber(balance);
}

function animateNumber(value) {
  let start = 0;
  let duration = 800;
  let startTime = null;

  function animate(time) {
    if (!startTime) startTime = time;
    let progress = time - startTime;
    let percent = Math.min(progress / duration, 1);
    let current = start + percent * (value - start);

    refundAmount.textContent =
      (value >= 0 ? "Refund: $" : "Balance: -$") +
      Math.abs(current).toFixed(2);

    if (percent < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

toggleBreakdown.addEventListener("click", () => {
  breakdownPanel.style.display =
    breakdownPanel.style.display === "none" ? "block" : "none";
});

incomeInput.addEventListener("input", calculate);
withheldInput.addEventListener("input", calculate);
selfInput.addEventListener("input", calculate);
stateInput.addEventListener("change", calculate);
statusInput.addEventListener("change", calculate);
