function calculate() {

  const status = document.getElementById("filingStatus").value;
  const dependent = document.getElementById("dependent").value;

  const income = parseFloat(document.getElementById("income").value) || 0;
  const selfIncome = parseFloat(document.getElementById("selfIncome").value) || 0;
  const withheld = parseFloat(document.getElementById("withheld").value) || 0;

  const totalIncome = income + selfIncome;

  // 2025 Standard Deductions
  let standardDeduction = status === "head" ? 21900 : 14600;

  // Dependent adjustment (2025 IRS rule approximation)
  if (dependent === "yes") {
    const dependentMinimum = 1250; // IRS minimum standard deduction for dependents
    const dependentCalc = totalIncome + 450;
    standardDeduction = Math.max(dependentMinimum, Math.min(standardDeduction, dependentCalc));
  }

  const taxableIncome = Math.max(0, totalIncome - standardDeduction);

  let tax = 0;

  // 2025 Federal Brackets (Simplified to 24%)
  if (status === "single") {

    if (taxableIncome <= 11600) {
      tax = taxableIncome * 0.10;
    } 
    else if (taxableIncome <= 47150) {
      tax = 11600 * 0.10 +
            (taxableIncome - 11600) * 0.12;
    } 
    else if (taxableIncome <= 100525) {
      tax = 11600 * 0.10 +
            (47150 - 11600) * 0.12 +
            (taxableIncome - 47150) * 0.22;
    } 
    else {
      tax = 11600 * 0.10 +
            (47150 - 11600) * 0.12 +
            (100525 - 47150) * 0.22 +
            (taxableIncome - 100525) * 0.24;
    }
  }

  if (status === "head") {

    if (taxableIncome <= 16550) {
      tax = taxableIncome * 0.10;
    } 
    else if (taxableIncome <= 63100) {
      tax = 16550 * 0.10 +
            (taxableIncome - 16550) * 0.12;
    } 
    else if (taxableIncome <= 100500) {
      tax = 16550 * 0.10 +
            (63100 - 16550) * 0.12 +
            (taxableIncome - 63100) * 0.22;
    } 
    else {
      tax = 16550 * 0.10 +
            (63100 - 16550) * 0.12 +
            (100500 - 63100) * 0.22 +
            (taxableIncome - 100500) * 0.24;
    }
  }

  // Self-employment tax (15.3%)
  const seTax = selfIncome * 0.153;

  const totalTax = tax + seTax;

  const result = withheld - totalTax;

  // Display result
  if (totalIncome === 0) {
    document.getElementById("resultMain").innerText = "Enter income to see results";
  } else {
    document.getElementById("resultMain").innerText =
      result >= 0
        ? "Estimated Refund: $" + result.toFixed(2)
        : "Estimated Amount Owed: $" + Math.abs(result).toFixed(2);
  }

  // Update breakdown
  document.getElementById("deductionDisplay").innerText = "$" + standardDeduction.toFixed(2);
  document.getElementById("totalIncome").innerText = "$" + totalIncome.toFixed(2);
  document.getElementById("taxableIncome").innerText = "$" + taxableIncome.toFixed(2);
  document.getElementById("fedTax").innerText = "$" + tax.toFixed(2);
  document.getElementById("seTax").innerText = "$" + seTax.toFixed(2);
  document.getElementById("withholdingDisplay").innerText = "$" + withheld.toFixed(2);
}
