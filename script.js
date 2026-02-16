function calculate() {

  const status = document.getElementById("filingStatus").value;
  const dependent = document.getElementById("dependent").value;
  const income = parseFloat(document.getElementById("income").value) || 0;
  const selfIncome = parseFloat(document.getElementById("selfIncome").value) || 0;
  const withheld = parseFloat(document.getElementById("withheld").value) || 0;

  const totalIncome = income + selfIncome;

  let standardDeduction = status === "head" ? 21900 : 14600;

  if (dependent === "yes") {
    standardDeduction = Math.min(standardDeduction, totalIncome + 450);
  }

  let taxableIncome = Math.max(0, totalIncome - standardDeduction);

 let tax = 0;

if (status === "single") {

  if (taxableIncome <= 11600) {
    tax = taxableIncome * 0.10;
  } else if (taxableIncome <= 47150) {
    tax = 11600 * 0.10 + (taxableIncome - 11600) * 0.12;
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

}

if (status === "head") {

  if (taxableIncome <= 16550) {
    tax = taxableIncome * 0.10;
  } else if (taxableIncome <= 63100) {
    tax = 16550 * 0.10 + (taxableIncome - 16550) * 0.12;
  } else if (taxableIncome <= 100500) {
    tax = 16550 * 0.10 +
          (63100 - 16550) * 0.12 +
          (taxableIncome - 63100) * 0.22;
  } else {
    tax = 16550 * 0.10 +
          (63100 - 16550) * 0.12 +
          (100500 - 63100) * 0.22 +
          (taxableIncome - 100500) * 0.24;
  }

}


  let seTax = selfIncome * 0.153;
  let totalTax = tax + seTax;

  let result = withheld - totalTax;

  document.getElementById("resultMain").innerText =
    result >= 0
      ? "Estimated Refund: $" + result.toFixed(2)
      : "Estimated Amount Owed: $" + Math.abs(result).toFixed(2);

  document.getElementById("deductionDisplay").innerText = "$" + standardDeduction.toFixed(2);
  document.getElementById("totalIncome").innerText = "$" + totalIncome.toFixed(2);
  document.getElementById("taxableIncome").innerText = "$" + taxableIncome.toFixed(2);
  document.getElementById("fedTax").innerText = "$" + tax.toFixed(2);
  document.getElementById("seTax").innerText = "$" + seTax.toFixed(2);
  document.getElementById("withholdingDisplay").innerText = "$" + withheld.toFixed(2);
}
