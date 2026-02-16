document.addEventListener("DOMContentLoaded", function () {

  const incomeInput = document.getElementById("w2Income");
  if (!incomeInput) return;

  const filingStatus = document.getElementById("filingStatus");
  const withholding = document.getElementById("withholding");
  const selfEmployment = document.getElementById("selfEmployment");

  const brackets = {
    single: [
      [11925, 0.10],
      [48475, 0.12],
      [103350, 0.22],
      [197300, 0.24],
      [250525, 0.32],
      [626350, 0.35],
      [Infinity, 0.37]
    ],
    married: [
      [23850, 0.10],
      [96950, 0.12],
      [206700, 0.22],
      [394600, 0.24],
      [501050, 0.32],
      [751600, 0.35],
      [Infinity, 0.37]
    ],
    head: [
      [17000, 0.10],
      [64850, 0.12],
      [103350, 0.22],
      [197300, 0.24],
      [250500, 0.32],
      [626350, 0.35],
      [Infinity, 0.37]
    ]
  };

  const standardDeduction = {
    single: 15000,
    married: 30000,
    head: 22500
  };

  function calculateTax() {

    let income = parseFloat(incomeInput.value) || 0;
    let withheld = parseFloat(withholding.value) || 0;
    let selfEmp = parseFloat(selfEmployment.value) || 0;
    let status = filingStatus.value;

    let deduction = standardDeduction[status];
    let taxable = Math.max(0, income - deduction);

    let tax = 0;
    let previousLimit = 0;

    for (let bracket of brackets[status]) {
      let [limit, rate] = bracket;

      if (taxable > previousLimit) {
        let taxableAtThisRate = Math.min(taxable, limit) - previousLimit;
        tax += taxableAtThisRate * rate;
        previousLimit = limit;
      }
    }

    let seTax = selfEmp * 0.153;
    let totalTax = tax + seTax;
    let net = withheld - totalTax;

    document.getElementById("refundAmount").innerText =
      net >= 0 ? "Refund: $" + net.toFixed(2)
               : "Amount Owed: $" + Math.abs(net).toFixed(2);

    document.getElementById("standardDeduction").innerText = "$" + deduction.toLocaleString();
    document.getElementById("taxableIncome").innerText = "$" + taxable.toLocaleString();
    document.getElementById("federalTax").innerText = "$" + tax.toFixed(2);
    document.getElementById("seTax").innerText = "$" + seTax.toFixed(2);
    document.getElementById("withholdingTotal").innerText = "$" + withheld.toLocaleString();
  }

  filingStatus.addEventListener("change", calculateTax);
  incomeInput.addEventListener("input", calculateTax);
  withholding.addEventListener("input", calculateTax);
  selfEmployment.addEventListener("input", calculateTax);

  calculateTax();
});
