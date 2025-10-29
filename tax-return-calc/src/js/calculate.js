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

// update DOM
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












