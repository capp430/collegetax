document.addEventListener("DOMContentLoaded", function(){

  // Fade animation
  const faders = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
      }
    });
  });
  faders.forEach(el=>observer.observe(el));

  const incomeInput=document.getElementById("income");
  if(!incomeInput) return;

  const withheldInput=document.getElementById("withheld");
  const selfInput=document.getElementById("self");
  const statusInput=document.getElementById("status");

  const refundAmount=document.getElementById("refundAmount");
  const deductionRow=document.getElementById("deductionRow");
  const taxableRow=document.getElementById("taxableRow");
  const taxRow=document.getElementById("taxRow");
  const seTaxRow=document.getElementById("seTaxRow");
  const withholdingRow=document.getElementById("withholdingRow");

  const deductions={single:15000,married:30000,hoh:22500};

  function calculate(){
    let income=parseFloat(incomeInput.value)||0;
    let withheld=parseFloat(withheldInput.value)||0;
    let selfIncome=parseFloat(selfInput.value)||0;

    let total=income+selfIncome;
    let deduction=deductions[statusInput.value];
    let taxable=Math.max(0,total-deduction);

    let tax=taxable*0.12;
    let seTax=selfIncome*0.153;
    let totalTax=tax+seTax;
    let balance=withheld-totalTax;

    deductionRow.textContent="$"+deduction.toLocaleString();
    taxableRow.textContent="$"+taxable.toLocaleString();
    taxRow.textContent="$"+tax.toFixed(2);
    seTaxRow.textContent="$"+seTax.toFixed(2);
    withholdingRow.textContent="$"+withheld.toLocaleString();

    refundAmount.textContent=(balance>=0?"Refund: $":"Owed: $")+Math.abs(balance).toFixed(2);
  }

  incomeInput.addEventListener("input",calculate);
  withheldInput.addEventListener("input",calculate);
  selfInput.addEventListener("input",calculate);
  statusInput.addEventListener("change",calculate);

});
