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

const slider = document.getElementById('deductionSlider');
const numberInput = document.getElementById('deductionInput');
const display = document.getElementById('deductionDisplay');



// Set max to income
slider.max = income;
numberInput.max = income;

// Sync slider -> number input
slider.addEventListener('input', () => {
  numberInput.value = slider.value;
  display.textContent = Number(slider.value).toLocaleString();

});

// Sync number input -> slider
numberInput.addEventListener('input', () => {
  let val = Number(numberInput.value);
  if (val < 0) val = 0;
  if (val > income) val = income;

  numberInput.value = val;
  slider.value = val;
  display.textContent = val.toLocaleString();
});

// Grab the new span
const taxAfterDeduction = document.getElementById('taxAfterDeduction');

// Function to calculate tax after deduction
function updateTaxAfterDeduction() {
  const deduction = Number(display.textContent.replace(/,/g, '')) || 0;
  const taxableIncome = Math.max(income - deduction, 0); // don't go below 0
  const taxAfter = calcTax(taxableIncome);               // using your existing calcTax function
  taxAfterDeduction.textContent = taxAfter.toLocaleString();
}

// Initial calculation
updateTaxAfterDeduction();

// Update in real-time when slider changes
slider.addEventListener('input', updateTaxAfterDeduction);
numberInput.addEventListener('input', updateTaxAfterDeduction);

// Grab the new span
const mlsAfterDeduction = document.getElementById('mlsAfterDeduction');

// Function to calculate MLS after deduction
function updateMlsAfterDeduction() {
  const deduction = Number(display.textContent.replace(/,/g, '')) || 0;
  const taxableIncome = Math.max(income - deduction, 0); // ensure non-negative

  // MLS uses household income plus your taxable income
  const newMlsIncome = taxableIncome + householdIncome;

  const mlsValue = calcAnnualMls(newMlsIncome, mlsStatus, dependents, mlsExempt);

  mlsAfterDeduction.textContent = mlsValue.toLocaleString();
}

// Initial calculation
updateMlsAfterDeduction();

// Update in real-time when slider changes
slider.addEventListener('input', updateMlsAfterDeduction);
numberInput.addEventListener('input', updateMlsAfterDeduction);

// Grab the total span
const totalSpan = document.getElementById('totalAmountOwedAfterDeduction');

function updateTotalOwed() {
  // Get the numbers from the spans, remove commas
  const tax = Number(document.getElementById('taxAfterDeduction').textContent.replace(/,/g, '')) || 0;
  const mls = Number(document.getElementById('mlsAfterDeduction').textContent.replace(/,/g, '')) || 0;

  const total = tax + mls;

  totalSpan.textContent = total.toLocaleString();
}

// Initial calculation
updateTotalOwed();

// Update whenever slider/number input changes
slider.addEventListener('input', updateTotalOwed);
numberInput.addEventListener('input', updateTotalOwed);

// Grab the taxReturn span
const taxReturnAfterDeduction = document.getElementById('taxReturnAfterDeduction');

function updateVisualTaxReturn() {
  // Get taxPaid - total owed after deduction
  const totalOwed = Number(document.getElementById('totalAmountOwedAfterDeduction').textContent.replace(/,/g, '')) || 0;
  const taxReturn = taxPaid - totalOwed;

  // Update value
  taxReturnAfterDeduction.textContent = `$${taxReturn.toLocaleString()}`;

  // Change color based on positive/negative
  if (taxReturn >= 0) {
    taxReturnAfterDeduction.classList.add('tax-positive');
    taxReturnAfterDeduction.classList.remove('tax-negative');
  } else {
    taxReturnAfterDeduction.classList.add('tax-negative');
    taxReturnAfterDeduction.classList.remove('tax-positive');
  }
}

// Initial update
updateVisualTaxReturn();

// Update in real-time whenever slider/number input changes
slider.addEventListener('input', updateVisualTaxReturn);
numberInput.addEventListener('input', updateVisualTaxReturn);


function updateTaxReturn() {
  // Get total owed
  const totalOwed = Number(document.getElementById('totalAmountOwedAfterDeduction').textContent.replace(/,/g, '')) || 0;

  // taxPaid from localStorage (already defined as number)
  const taxReturn = taxPaid - totalOwed;

  // Display
  taxReturnSpan.textContent = Math.max(taxReturn).toLocaleString();
}

// Initial calculation
updateTaxReturn();

// Update whenever slider or number input changes
slider.addEventListener('input', updateTaxReturn);
numberInput.addEventListener('input', updateTaxReturn);







