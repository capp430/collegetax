function calculate() {
  const income = parseFloat(document.getElementById("income").value) || 0;
  const withheld = parseFloat(document.getElementById("withheld").value) || 0;

  const standardDeduction = 14600;

  let taxableIncome = Math.max(0, income - standardDeduction);

  let tax = 0;

  if (taxableIncome <= 11600) {
    tax = taxableIncome * 0.10;
  } else if (taxableIncome <= 47150) {
    tax = 11600 * 0.10 + (taxableIncome - 11600) * 0.12;
  } else {
    tax = 11600 * 0.10 +
          (47150 - 11600) * 0.12 +
          (taxableIncome - 47150) * 0.22;
  }

  let result = withheld - tax;

  document.getElementById("resultMain").innerText =
    result >= 0
      ? "Estimated Refund: $" + result.toFixed(2)
      : "Estimated Amount Owed: $" + Math.abs(result).toFixed(2);

  document.getElementById("taxableIncome").innerText =
    "$" + taxableIncome.toFixed(2);

  document.getElementById("fedTax").innerText =
    "$" + tax.toFixed(2);

  document.getElementById("withholding").innerText =
    "$" + withheld.toFixed(2);
}
