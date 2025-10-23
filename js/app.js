const singleRadio = document.getElementById('mlsSingle');
const familyRadio = document.getElementById('mlsFamily');
const dependentsRow = document.getElementById('dependentsRow');
const dependentsInput = document.getElementById('dependents');
const spouseIncomeInput = document.getElementById('mlsIncome');

// Default selection
singleRadio.checked = true;
dependentsRow.style.display = 'none';

// Toggle dependents row
function toggleDependents() {
  dependentsRow.style.display = familyRadio.checked ? 'block' : 'none';
  if (!familyRadio.checked) {
    dependentsInput.value = 0;
    spouseIncomeInput.value = 0;
  }
}

// Listen for changes
singleRadio.addEventListener('change', toggleDependents);
familyRadio.addEventListener('change', toggleDependents);

// Initial toggle on page load
toggleDependents();


const incomeInput = document.getElementById('income');
incomeInput.addEventListener('input', () => {
  if (incomeInput.value < 0) incomeInput.value = 0;
});

const taxForm = document.getElementById('taxForm');

taxForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Stop page refresh

  const income = parseFloat(document.getElementById('income').value);
  const taxPaid = parseFloat(document.getElementById('tax').value);
  const mlsExempt = parseInt(document.getElementById('mlsExempt').value);
  const dependents = parseInt(document.getElementById('dependents').value);
  const mlsIncome = parseInt(document.getElementById('mlsIncome').value);

  // Validation: tax paid cannot exceed income
  if (taxPaid > income) {
    alert('Error: Tax Paid cannot be greater than Annual Income.');
    return;
  }

  // Get selected living condition
  const selected = document.querySelector('input[name="mlsStatus"]:checked');
  if (!selected) {
    alert("Please select Single or Family");
    return;
  }

  // Save values to localStorage
  localStorage.setItem('income', income);
  localStorage.setItem('taxPaid', taxPaid);
  localStorage.setItem('mlsExempt', mlsExempt);
  localStorage.setItem('dependents', dependents);
  localStorage.setItem('mlsStatus', selected.value);
  localStorage.setItem('mlsIncome', mlsIncome);

  // Redirect to results page
  window.location.href = 'results.html';
});
