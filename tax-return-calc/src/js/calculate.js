import { calcTax, calcAnnualMls } from './calculatorFunctions.js';

const income = parseFloat(localStorage.getItem('income')) || 0;
const taxPaid = parseFloat(localStorage.getItem('taxPaid')) || 0;
const mlsExempt = parseInt(localStorage.getItem('mlsExempt'), 10) || 0;
const dependents = parseInt(localStorage.getItem('dependents'), 10) || 0;
const mlsStatus = localStorage.getItem('mlsStatus') || 'single';
const householdIncome = parseInt(localStorage.getItem('mlsIncome'), 10) || 0;

let mlsIncome = income + householdIncome;

let tax = calcTax(income);
let mls = calcAnnualMls(mlsIncome, mlsStatus, dependents, mlsExempt, income);
let totalAmountOwed = tax + mls;
let taxReturn = taxPaid - totalAmountOwed;

// Update original results (unchanged)
document.getElementById('incomeDisplay').textContent = income.toLocaleString();
document.getElementById('taxPaidDisplay').textContent = taxPaid.toLocaleString();
document.getElementById('mlsExemptDisplay').textContent = mlsExempt;
document.getElementById('dependentsDisplay').textContent = dependents;
document.getElementById('actualTaxDisplay').textContent = tax.toLocaleString();
document.getElementById('mlsStatusDisplay').textContent = mlsStatus;
document.getElementById('mlsIncomeDisplay').textContent = mlsIncome.toLocaleString();
document.getElementById('mlsDisplay').textContent = mls.toLocaleString();
document.getElementById('totalAmountOwed').textContent = totalAmountOwed.toLocaleString();
document.getElementById('taxReturnDisplay').textContent = taxReturn.toLocaleString();

// --- LIVE UPDATE WITH DEDUCTIONS ---

// Store original values
const originalTaxableIncome = income;
const originalMls = mls;
const originalTotalOwed = totalAmountOwed;
const originalTaxReturn = taxReturn;

// Function to update the second results div
export function updateWithDeductions(totalDeductions = 0) {
    totalDeductions = parseFloat(totalDeductions) || 0;

    let taxableIncome, newTax, newMls, totalOwed, newTaxReturn;

    if (totalDeductions <= 0) {
        // Use original values if no deductions
        taxableIncome = originalTaxableIncome;
        newTax = tax;
        newMls = originalMls;
        totalOwed = originalTotalOwed;
        newTaxReturn = originalTaxReturn;
    } else {
        taxableIncome = Math.max(originalTaxableIncome - totalDeductions, 0);
        newTax = calcTax(taxableIncome);
        newMls = calcAnnualMls(mlsIncome, mlsStatus, dependents, mlsExempt, taxableIncome);
        totalOwed = newTax + newMls;
        newTaxReturn = taxPaid - totalOwed;
    }

    document.getElementById('taxableIncomeAfterDeduction').textContent = taxableIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('mlsAfterDeduction').textContent = newMls.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('taxOwedAfterDeduction').textContent = totalOwed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('taxReturnAfterDeduction').textContent = newTaxReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Initialize immediately on page load with default values
updateWithDeductions();
