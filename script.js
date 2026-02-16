function formatMoney(num) {
  return "$" + num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function calculateTax(income, brackets) {
  let tax = 0;
  let remaining = income;

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];

    if (remaining > bracket.limit) {
      tax += bracket.limit * bracket.rate;
      remaining -= bracket.limit;
    } else {
      tax += remaining * bracket.rate;
      break;
    }
  }

  return tax;
}

function runCalculator() {

  const status = document.getElementById("status").value;
  const dependent = document.getElementById("dependent").value;
  const w2 = Number(document.getElementById("w2").value) || 0;
  const selfIncome = Number(document.getElementById("self").value) || 0;
  const withheld = Number(document.getElementById("withheld").value) || 0;

  const totalIncome = w2 + selfIncome;

  let standardDeduction = 0;

  if (status === "single") standardDeduction = 14600;
  if (status === "head") standardDeduction = 21900;

  if (dependent === "yes") {
    standardDeduction = Math.min(totalIncome + 400, 14600);
  }

  const taxableIncome = Math.max(0, totalIncome - standardDeduction);

  const brackets = [
    { limit: 11000, rate: 0.10 },
    { limit: 33725, rate: 0.12 },
    { limit: 50650, rate: 0.22 },
    { limit: 86725, rate: 0.24 }
  ];

  const federalTax = calculateTax(taxableIncome, brackets);

  const seTax = selfIncome * 0.153;

  const totalTax = federalTax + seTax;

  const refundOrOwed = withheld - totalTax;

  document.getElementById("deduction").innerText = formatMoney(standardDeduction);
  document.getElementById("totalIncome").innerText = formatMoney(totalIncome);
  document.getElementById("taxable").innerText = formatMoney(taxableIncome);
  document.getElementById("federalTax").innerText = formatMoney(federalTax);
  document.getElementById("seTax").innerText = formatMoney(seTax);
  document.getElementById("totalWithheld").innerText = formatMoney(withheld);
  document.getElementById("finalAmount").innerText = formatMoney(Math.abs(refundOrOwed));

  const message = document.getElementById("resultMessage");

  if (totalIncome === 0) {
    message.innerText = "Enter income to see results";
    return;
  }

  if (refundOrOwed > 0) {
    message.innerText = "Estimated Refund";
    message.className = "refund";
  } else if (refundOrOwed < 0) {
    message.innerText = "Estimated Amount Owed";
    message.className = "owed";
  } else {
    message.innerText = "No Balance Due";
    message.className = "";
  }
}

document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", runCalculator);
});
