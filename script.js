document.addEventListener("input", calculate);

function calculate() {
  const status = document.getElementById("status").value;
  const income = Number(document.getElementById("income").value);
  const withheld = Number(document.getElementById("withheld").value);
  const selfIncome = Number(document.getElementById("selfIncome").value);

  const deduction = status === "single" ? 14600 : 21900;

  const taxable = Math.max(0, income - deduction);

  const brackets = [
    { limit: 11000, rate: 0.10 },
    { limit: 44725, rate: 0.12 },
    { limit: 95375, rate: 0.22 }
  ];

  let tax = 0;
  let remaining = taxable;
  let previousLimit = 0;

  for (let bracket of brackets) {
    if (remaining <= 0) break;
    const amount = Math.min(remaining, bracket.limit - previousLimit);
    tax += amount * bracket.rate;
    remaining -= amount;
    previousLimit = bracket.limit;
  }

  const seTax = selfIncome * 0.153;
  const totalTax = tax + seTax;
  const refund = withheld - totalTax;

  document.getElementById("resultText").innerHTML =
    refund >= 0 ? `<h3>Refund: $${refund.toFixed(2)}</h3>` :
    `<h3>Amount Owed: $${Math.abs(refund).toFixed(2)}</h3>`;

  document.getElementById("deduction").innerText = "$" + deduction.toLocaleString();
  document.getElementById("taxable").innerText = "$" + taxable.toLocaleString();
  document.getElementById("federalTax").innerText = "$" + tax.toFixed(2);
  document.getElementById("seTax").innerText = "$" + seTax.toFixed(2);
  document.getElementById("withholdingTotal").innerText = "$" + withheld.toFixed(2);
}
