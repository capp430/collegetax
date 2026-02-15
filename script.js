// ==============================
// CONSTANTS
// ==============================

const STANDARD_DEDUCTION = 14600;
const SELF_EMPLOYMENT_RATE = 0.153;

// ==============================
// SCROLL ANIMATION
// ==============================

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

// ==============================
// FORMATTER
// ==============================

function formatCurrency(num) {
  return "$" + num.toFixed(2);
}

// ==============================
// COUNT-UP ANIMATION
// ==============================

function animateValue(element, start, end, duration) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const percent = Math.min(progress / duration, 1);
    const value = start + (end - start) * percent;

    element.innerText = formatCurrency(value);

    if (percent < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// ==============================
// TAX CALCULATION
// ==============================

function calculateFederalTax(taxableIncome) {
  if (taxableIncome <= 0) return 0;

  if (taxableIncome <= 11600) {
    return taxableIncome * 0.10;
  }

  return (11600 * 0.10) + ((taxableIncome - 11600) * 0.12);
}

// ==============================
// MAIN FUNCTION
// ==============================

function calculateTaxes() {

  const w2 = Number(document.getElementById("w2").value) || 0;
  const withheld = Number(document.getElementById("withheld").value) || 0;
  const income1099 = Number(document.getElementById("income1099").value) || 0;
  const scholarships = Number(document.getElementById("scholarships").value) || 0;
  const stateTax = document.getElementById("stateTax").value;

  const totalIncome = w2 + income1099 + scholarships;
  let taxableIncome = totalIncome - STANDARD_DEDUCTION;
  if (taxableIncome < 0) taxableIncome = 0;

  const federalTax = calculateFederalTax(taxableIncome);
  const selfTax = income1099 * SELF_EMPLOYMENT_RATE;
  const finalAmount = withheld - federalTax - selfTax;

  // Animate numbers
  animateValue(document.getElementById("totalIncome"), 0, totalIncome, 800);
  animateValue(document.getElementById("taxableIncome"), 0, taxableIncome, 800);
  animateValue(document.getElementById("federalTax"), 0, federalTax, 800);
  animateValue(document.getElementById("selfTax"), 0, selfTax, 800);
  animateValue(document.getElementById("refund"), 0, Math.abs(finalAmount), 900);

  // Recommendation
  const rec = document.getElementById("recommendation");
  rec.className = "result-box show";

  if (totalIncome > STANDARD_DEDUCTION || income1099 > 400 || withheld > 0) {
    if (finalAmount >= 0) {
      rec.classList.add("info");
      rec.innerText = "You likely should file your federal taxes and may receive a refund.";
    } else {
      rec.classList.add("warning");
      rec.innerText = "You likely owe federal taxes and should file to avoid penalties.";
    }
  } else {
    rec.classList.add("success");
    rec.innerText = "You may not be required to file federally based on your income.";
  }

  // Confidence Score
  let complexity = 0;
  if (income1099 > 0) complexity++;
  if (scholarships > 0) complexity++;
  if (stateTax === "unsure") complexity++;

  const confidence = document.getElementById("confidence");

  if (complexity === 0) {
    confidence.innerText = "Confidence Level: High — Simple income structure.";
  } else if (complexity === 1) {
    confidence.innerText = "Confidence Level: Moderate — Some complexity present.";
  } else {
    confidence.innerText = "Confidence Level: Lower — Multiple income types increase filing complexity.";
  }

}

