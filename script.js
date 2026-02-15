document.addEventListener("DOMContentLoaded", function(){

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
  const stateInput=document.getElementById("state");

  const resultCard=document.getElementById("resultCard");
  const refundAmount=document.getElementById("refundAmount");

  const deductionRow=document.getElementById("deductionRow");
  const taxableRow=document.getElementById("taxableRow");
  const taxRow=document.getElementById("taxRow");
  const seTaxRow=document.getElementById("seTaxRow");
  const withholdingRow=document.getElementById("withholdingRow");

  const progressBar=document.getElementById("progressBar");
  const breakdownPanel=document.getElementById("breakdownPanel");
  const toggleBreakdown=document.getElementById("toggleBreakdown");
  const bracketChart=document.getElementById("bracketChart");

  const deductions={single:15000,married:30000,hoh:22500};

  const brackets=[
    {limit:11925,rate:.10},
    {limit:48475,rate:.12},
    {limit:103350,rate:.22},
    {limit:197300,rate:.24},
    {limit:Infinity,rate:.32}
  ];

  function calculate(){
    let income=parseFloat(incomeInput.value)||0;
    let withheld=parseFloat(withheldInput.value)||0;
    let selfIncome=parseFloat(selfInput.value)||0;
    let total=income+selfIncome;

    progressBar.style.width=(income>0?50:0)+(withheld>0?50:0)+"%";

    let deduction=deductions[statusInput.value];
    let taxable=Math.max(0,total-deduction);

    let tax=0,prev=0;
    brackets.forEach(b=>{
      let amount=Math.min(taxable,b.limit)-prev;
      if(amount>0){
        tax+=amount*b.rate;
        prev=b.limit;
      }
    });

    let seTax=selfIncome*.153;
    let totalTax=tax+seTax;
    let balance=withheld-totalTax;

    updateDisplay(deduction,taxable,tax,seTax,withheld,balance);
    updateChart(taxable);
  }

  function updateDisplay(deduction,taxable,tax,seTax,withheld,balance){
    deductionRow.textContent="$"+deduction.toLocaleString();
    taxableRow.textContent="$"+taxable.toLocaleString();
    taxRow.textContent="$"+tax.toFixed(2);
    seTaxRow.textContent="$"+seTax.toFixed(2);
    withholdingRow.textContent="$"+withheld.toLocaleString();

    refundAmount.textContent=(balance>=0?"Refund: $":"Owed: $")+Math.abs(balance).toFixed(2);

    if(balance>=0){
      resultCard.textContent="You may receive a refund.";
      resultCard.className="result-box success";
    }else{
      resultCard.textContent="You may owe additional tax.";
      resultCard.className="result-box warning";
    }
  }

  function updateChart(taxable){
    bracketChart.innerHTML="";
    brackets.forEach(b=>{
      let bar=document.createElement("div");
      bar.className="bracket-bar";
      if(taxable>=b.limit) bar.classList.add("active");
      bracketChart.appendChild(bar);
    });
  }

  toggleBreakdown.addEventListener("click",()=>{
    breakdownPanel.classList.toggle("hidden");
  });

  document.querySelectorAll(".accordion-header").forEach(header=>{
    header.addEventListener("click",()=>{
      const content=header.nextElementSibling;
      content.style.display=content.style.display==="block"?"none":"block";
    });
  });

  incomeInput.addEventListener("input",calculate);
  withheldInput.addEventListener("input",calculate);
  selfInput.addEventListener("input",calculate);
  statusInput.addEventListener("change",calculate);
  stateInput.addEventListener("change",calculate);

});
