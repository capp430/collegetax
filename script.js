const w2 = document.getElementById("w2");
const self = document.getElementById("self");
const withheld = document.getElementById("withheld");
const status = document.getElementById("status");
const dependent = document.getElementById("dependent");

function format(num){
  return "$" + num.toFixed(2);
}

function calculate(){

  const w2Income = Number(w2.value) || 0;
  const selfIncome = Number(self.value) || 0;
  const withheldAmount = Number(withheld.value) || 0;

  let deduction = 14600; // 2025 single est

  if(status.value === "married") deduction = 29200;
  if(status.value === "hoh") deduction = 21900;
  if(dependent.value === "yes") deduction = 1300;

  const totalIncome = w2Income + selfIncome;
  const taxableIncome = Math.max(totalIncome - deduction, 0);

  let federalTax = 0;

  if(taxableIncome <= 11600){
    federalTax = taxableIncome * 0.10;
  } else if(taxableIncome <= 47150){
    federalTax = 1160 + (taxableIncome - 11600) * 0.12;
  } else {
    federalTax = 5426 + (taxableIncome - 47150) * 0.22;
  }

  const seTax = selfIncome * 0.153;

  const refund = withheldAmount - (federalTax + seTax);

  document.getElementById("deduction").textContent = format(deduction);
  document.getElementById("total").textContent = format(totalIncome);
  document.getElementById("taxable").textContent = format(taxableIncome);
  document.getElementById("federal").textContent = format(federalTax);
  document.getElementById("se").textContent = format(seTax);
  document.getElementById("withholding").textContent = format(withheldAmount);
  document.getElementById("refund").textContent = format(refund);
}

[w2,self,withheld,status,dependent].forEach(el => {
  el.addEventListener("input", calculate);
});
