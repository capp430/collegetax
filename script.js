function calculate() {

  const filingStatus = document.getElementById("filingStatus").value;
  const dependent = document.getElementById("dependent").value;
  const income = parseFloat(document.getElementById("income").value) || 0;
  const selfIncome = parseFloat(document.getElementById("selfIncome").value) || 0;
  const withheld = parseFloat(document.getElementById("withheld").value) || 0;

  const totalIncome = income + selfIncome;

  // 2025 standard deductions (estimated)
  let standardDeduction = 14600; // single
  if (filingStatus === "head") {
    standardDeduction = 21900;
  }

  // dependent adjustment
  if (dependent === "yes") {
    standardDeduction = Math.min(standardDeduction, totalIncome + 450);
  }

  let taxableIncome = Math.max(0, totalIncome - standardDeduction);

  let tax = 0;

  // 2025 SINGLE brackets simplified
  if (taxableIncome <= 11600) {
    tax = taxableIncome * 0.10;
  } else if (taxableIncome <= 47150) {
    tax = 11600 * 0.10 +
          (taxableIncome - 11600) * 0.12;
  } else if (taxableIncome <= 100525) {
    tax = 11600 * 0.10 +
          (47150 - 11600) * 0.12 +
          (taxableIncome - 47150) * 0.22;
  } else {
    tax = 11600 * 0.10 +
          (47150 - 11600) * 0.12 +
          (100525 - 47150) * 0.22 +
          (taxableIncome - 100525) * 0.24;
  }

  // Self-employment tax (15.3%)
  let seTax = selfIncome > 0 ? selfIncome * 0.153 : 0;

  let totalTax = tax + seTax;

  let result = withheld - totalTax;

  document.getElementById("resultMain").innerText =
    result >= 0
      ? "Estimated Refund: $" + result.toFixed(2)
      : "Estimated Amount Owed: $" + Math.abs(result).toFixed(2);

  document.getElementById("deductionDisplay").innerText =
    "$" + standardDeduction.toFixed(2);

  document.getElementById("totalIncome").innerText =
    "$" + totalIncome.toFixed(2);

  document.getElementById("taxableIncome").innerText =
    "$" + taxableIncome.toFixed(2);

  document.getElementById("fedTax").innerText =
    "$" + tax.toFixed(2);

  document.getElementById("seTax").innerText =
    "$" + seTax.toFixed(2);

  document.getElementById("withholding").innerText =
    "$" + withheld.toFixed(2);
}
