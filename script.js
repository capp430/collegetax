const inputs = ["w2","self","withheld","status","dependent"];

inputs.forEach(id => {
  document.getElementById(id).addEventListener("input", calculate);
});

function format(num){
  return "$" + num.toFixed(2);
}

function calculate(){

  const w2 = Number(document.getElementById("w2").value) || 0;
  const self = Number(document.getElementById("self").value) || 0;
  const withheld = Number(document.getElementById("withheld").value) || 0;
  const status = document.getElementById("status").value;
  const dependent = document.getElementById("dependent").value;

  let deduction = 14600;
  if(status === "married") deduction = 29200;
  if(status === "hoh") deduction = 21900;
  if(dependent === "yes") deduction = 1300;

  const totalIncome = w2 + self;
  const taxable = Math.max(totalIncome - deduction, 0);

  let federal = 0;
  if(taxable <= 11600){
    federal = taxable * 0.10;
  } else if(taxable <= 47150){
    federal = 1160 + (taxable - 11600) * 0.12;
  } else {
    federal = 5426 + (taxable - 47150) * 0.22;
  }

  const seTax = self * 0.153;
  const refund = withheld - (federal + seTax);

  document.getElementById("deduction").textContent = format(deduction);
  document.getElementById("total").textContent = format(totalIncome);
  document.getElementById("taxable").textContent = format(taxable);
  document.getElementById("federal").textContent = format(federal);
  document.getElementById("se").textContent = format(seTax);
  document.getElementById("withholding").textContent = format(withheld);
  document.getElementById("refund").textContent = format(refund);
}
