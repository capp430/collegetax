document.addEventListener("DOMContentLoaded", function () {

    if (!document.getElementById("w2Income")) return;

    const filingStatus = document.getElementById("filingStatus");
    const w2Income = document.getElementById("w2Income");
    const withholding = document.getElementById("withholding");
    const selfEmployment = document.getElementById("selfEmployment");

    function calculate() {

        let income = parseFloat(w2Income.value) || 0;
        let withheld = parseFloat(withholding.value) || 0;
        let selfEmp = parseFloat(selfEmployment.value) || 0;

        let standardDeduction = {
            single: 14600,
            married: 29200,
            head: 21900
        };

        let deduction = standardDeduction[filingStatus.value] || 14600;

        let taxable = Math.max(0, income - deduction);

        let tax = 0;

        if (taxable <= 11600) tax = taxable * 0.10;
        else if (taxable <= 47150) tax = 11600 * 0.10 + (taxable - 11600) * 0.12;
        else tax = 11600 * 0.10 + (47150 - 11600) * 0.12 + (taxable - 47150) * 0.22;

        let seTax = selfEmp * 0.153;

        let totalTax = tax + seTax;
        let net = withheld - totalTax;

        document.getElementById("refundAmount").innerText =
            net >= 0 ? "Refund: $" + net.toFixed(2) : "Amount Owed: $" + Math.abs(net).toFixed(2);

        document.getElementById("taxableIncome").innerText = "$" + taxable.toFixed(2);
        document.getElementById("federalTax").innerText = "$" + tax.toFixed(2);
        document.getElementById("seTax").innerText = "$" + seTax.toFixed(2);
        document.getElementById("withholdingTotal").innerText = "$" + withheld.toFixed(2);
        document.getElementById("standardDeduction").innerText = "$" + deduction.toFixed(2);
    }

    filingStatus.addEventListener("change", calculate);
    w2Income.addEventListener("input", calculate);
    withholding.addEventListener("input", calculate);
    selfEmployment.addEventListener("input", calculate);

    calculate();
});
