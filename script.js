function calculate() {

  const status = document.getElementById("filingStatus").value;
  const dependent = document.getElementById("dependent").value;

  const income = parseFloat(document.getElementById("income").value) || 0;
  const selfIncome = parseFloat(document.getElementById("selfIncome").value) || 0;
  const withheld = parseFloat(document.getElementById("withheld").value) || 0;

  const totalIncome = income + selfIncome;

  let standardDeduction = status === "head" ? 21900 : 14600;

  if (dependent === "yes") {
    const dependentMinimum = 1250;
    const dependentCalc = totalIncome + 450;
    standardDeduction = Math.max(dependentMinimum, Math.min(standardDeduction, dependentCalc));
  }

  const taxableIncome = Math.max(0, totalIncome - standardDeduction);

  let tax = 0;
  let marginalRate = 0;

  if (status === "single") {

    if (taxableIncome <= 11600) {
      tax = taxableIncome * 0.10;
      marginalRate = 10;
    } 
    else if (taxableIncome <= 47150) {
      tax = 11600 * 0.10 + (taxableIncome - 11600) * 0.12;
      marginalRate = 12;
    } 
    else if (taxableIncome <= 100525) {
      tax = 11600 * 0.10 +
            (47150 - 11600) * 0.12 +
            (taxableIncome - 47150) * 0.22;
      marginalRate = 22;
    } 
    else {
      tax = 11600 * 0.10 +
            (47150 - 11600) * 0.12 +
            (100525 - 47150) * 0.22 +
            (taxableIncome - 100525) * 0.24;
      marginalRate = 24;
    }
  }

  if (status === "head") {

    if (taxableIncome <= 16550) {
      tax = taxableIncome * 0.10;
      marginalRate = 10;
    } 
    else if (taxableIncome <= 63100) {
      tax = 16550 * 0.10 + (taxableIncome - 16550) * 0.12;
      marginalRate = 12;
    } 
    else if (taxableIncome <= 100500) {
      tax = 16550 * 0.10 +
            (63100 - 16550) * 0.12 +
            (taxableIncome - 63100) * 0.22;
      marginalRate = 22;
    } 
    else {
      tax = 16550 * 0.10 +
            (63100 - 16550) * 0.12 +
            (100500 - 63100) * 0.22 +
            (taxableIncome - 100500) * 0.24;
      marginalRate = 24;
    }
  }

  const seTax = selfIncome * 0.153;
  const totalTax = tax + seTax;

  const result = withheld - totalTax;

  const effectiveRate = totalIncome > 0 ? ((tax / totalIncome) * 100).toFixed(2) : 0;

  const resultElement = document.getElementById("resultMain");

  if (totalIncome === 0) {
    resultElement.innerText = "Enter income to see results";
    resultElement.className = "result-main";
  } else {
    if (result >= 0) {
      resultElement.innerText = "Estimated Refund: $" + result.toFixed(2);
      resultElement.className = "result-main refund";
    } else {
      resultElement.innerText = "Estimated Amount Owed: $" + Math.abs(result).toFixed(2);
      resultElement.className = "result-main owed";
    }
  }

  document.getElementById("deductionDisplay").innerText = "$" + standardDeduction.toFixed(2);
  document.getElementById("totalIncome").innerText = "$" + totalIncome.toFixed(2);
  document.getElementById("taxableIncome").innerText = "$" + taxableIncome.toFixed(2);
  document.getElementById("fedTax").innerText = "$" + tax.toFixed(2);
  document.getElementById("seTax").innerText = "$" + seTax.toFixed(2);
  document.getElementById("withholdingDisplay").innerText = "$" + withheld.toFixed(2);
  document.getElementById("marginalRate").innerText = marginalRate + "%";
  document.getElementById("effectiveRate").innerText = effectiveRate + "%";

  // Filing requirement logic
  let filingNotice = document.getElementById("filingNotice");

  if (selfIncome > 0) {
    filingNotice.innerText = "You are required to file because you have self-employment income.";
  }
  else if (totalIncome > standardDeduction) {
    filingNotice.innerText = "You likely need to file because your income exceeds the standard deduction.";
  }
  else if (withheld > 0) {
    filingNotice.innerText = "You may not be required to file, but you should file to receive a refund.";
  }
  else {
    filingNotice.innerText = "You may not be required to file based on current income.";
  }
}
