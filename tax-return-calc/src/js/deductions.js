const deductionContainer = document.getElementById("deductionContainer");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const addLonelyDeductionBtn = document.getElementById("addLonelyDeductionBtn");
const overallTotalDisplay = document.getElementById("overallTotal");

// === Helper: Update the grand total for everything ===
function updateOverallTotal() {
    let total = 0;

    // Sum all category deductions
    document.querySelectorAll(".category .deductionRow input[type='number']").forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    // Sum all lonely deductions
    document.querySelectorAll(".lonelyDeduction .deductionRow input[type='number']").forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    overallTotalDisplay.textContent = total.toFixed(2);
}

// === Helper: Create a single deduction row ===
function createDeduction(updateCategoryCallback) {
    const deductionRow = document.createElement("div");
    deductionRow.classList.add("deductionRow");

    deductionRow.innerHTML = `
        <input type="text" placeholder="Deduction Name">
        <input type="number" placeholder="Amount" min="0">
        <input type="text" placeholder="Receipt # (optional)">
        <input type="date">
        <button class="removeDeductionBtn">✖</button>
    `;

    const amountInput = deductionRow.querySelector('input[type="number"]');
    const removeBtn = deductionRow.querySelector(".removeDeductionBtn");

    amountInput.addEventListener("input", () => {
        if (updateCategoryCallback) updateCategoryCallback();
        updateOverallTotal();
    });

    removeBtn.addEventListener("click", () => {
        deductionRow.remove();
        if (updateCategoryCallback) updateCategoryCallback();
        updateOverallTotal();
    });

    return deductionRow;
}

// === Helper: Update category total ===
function updateCategoryTotal(categoryDiv) {
    const totalDisplay = categoryDiv.querySelector(".categoryTotal span");
    let total = 0;

    categoryDiv.querySelectorAll(".deductionRow input[type='number']").forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    totalDisplay.textContent = total.toFixed(2);
}

// === Create a new category ===
function createCategory() {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");

    categoryDiv.innerHTML = `
        <div class="categoryHeader">
            <input type="text" placeholder="Category Name..." class="categoryName">
            <button class="addDeductionBtn">+ Add Deduction</button>
            <button class="removeCategoryBtn">✖</button>
        </div>
        <div class="deductionList"></div>
        <div class="categoryTotal">Total: $<span>0.00</span></div>
    `;

    const addDeductionBtn = categoryDiv.querySelector(".addDeductionBtn");
    const removeCategoryBtn = categoryDiv.querySelector(".removeCategoryBtn");
    const deductionList = categoryDiv.querySelector(".deductionList");

    // Add new deduction
    addDeductionBtn.addEventListener("click", () => {
        deductionList.appendChild(createDeduction(() => updateCategoryTotal(categoryDiv)));
        updateCategoryTotal(categoryDiv);
        updateOverallTotal();
    });

    // Remove category with confirmation if not empty
    removeCategoryBtn.addEventListener("click", () => {
        const hasDeductions = deductionList.children.length > 0;
        if (hasDeductions) {
            const confirmDelete = confirm(
                "This category has deductions. Are you sure you want to remove it?"
            );
            if (!confirmDelete) return;
        }
        categoryDiv.remove();
        updateOverallTotal();
    });

    deductionContainer.appendChild(categoryDiv);
}

// === Create a lonely deduction ===
function createLonelyDeduction() {
    const lonelyDiv = document.createElement("div");
    lonelyDiv.classList.add("lonelyDeduction");

    const title = document.createElement("h3");
    title.textContent = "New Deduction";

    const deductionRow = createDeduction(() => updateOverallTotal());
    const nameInput = deductionRow.querySelector('input[type="text"]');
    const amountInput = deductionRow.querySelector('input[type="number"]');

    // Update title automatically
    function updateTitle() {
        const name = nameInput.value || "New Deduction";
        const amount = parseFloat(amountInput.value) || 0;
        title.textContent = `${name} - $${amount.toFixed(2)}`;
    }

    nameInput.addEventListener("input", updateTitle);
    amountInput.addEventListener("input", updateTitle);

    // Remove entire lonely deduction on ✖
    const removeBtn = deductionRow.querySelector(".removeDeductionBtn");
    removeBtn.addEventListener("click", () => {
        lonelyDiv.remove();
        updateOverallTotal();
    });

    lonelyDiv.appendChild(title);
    lonelyDiv.appendChild(deductionRow);
    deductionContainer.appendChild(lonelyDiv);
}

// === Button Listeners ===
addCategoryBtn.addEventListener("click", createCategory);
addLonelyDeductionBtn.addEventListener("click", createLonelyDeduction);
