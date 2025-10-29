const deductionContainer = document.getElementById("deductionContainer");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const addLonelyDeductionBtn = document.getElementById("addLonelyDeductionBtn");
const overallTotalDisplay = document.getElementById("overallTotal");
const saveToLocalBtn = document.getElementById("saveToLocalBtn");

// === Helper: format number with commas ===
function formatNumber(num) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// === Update overall total ===
function updateOverallTotal() {
    let total = 0;

    document.querySelectorAll(".category .deductionRow input[type='number']").forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    document.querySelectorAll(".lonelyDeduction .deductionRow input[type='number']").forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    overallTotalDisplay.textContent = formatNumber(total);
}

// === Create a single deduction row ===
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

// === Update category total ===
function updateCategoryTotal(categoryDiv) {
    const totalDisplay = categoryDiv.querySelector(".categoryTotal span");
    let total = 0;

    categoryDiv.querySelectorAll(".deductionRow input[type='number']").forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    totalDisplay.textContent = formatNumber(total);
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

    addDeductionBtn.addEventListener("click", () => {
        deductionList.appendChild(createDeduction(() => updateCategoryTotal(categoryDiv)));
        updateCategoryTotal(categoryDiv);
        updateOverallTotal();
    });

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
    return categoryDiv; // ✅ return it so we can reuse in loading
}

// === Create a lonely deduction ===
function createLonelyDeduction(prefillData = null) {
    const lonelyDiv = document.createElement("div");
    lonelyDiv.classList.add("lonelyDeduction");

    const title = document.createElement("h3");
    title.textContent = "New Deduction";

    const deductionRow = createDeduction(() => updateOverallTotal());
    const nameInput = deductionRow.querySelector('input[type="text"]');
    const amountInput = deductionRow.querySelector('input[type="number"]');
    const receiptInput = deductionRow.querySelectorAll("input")[2];
    const dateInput = deductionRow.querySelectorAll("input")[3];

    function updateTitle() {
        const name = nameInput.value || "New Deduction";
        const amount = parseFloat(amountInput.value) || 0;
        title.textContent = `${name} - $${formatNumber(amount)}`;
    }

    nameInput.addEventListener("input", updateTitle);
    amountInput.addEventListener("input", updateTitle);

    const removeBtn = deductionRow.querySelector(".removeDeductionBtn");
    removeBtn.addEventListener("click", () => {
        lonelyDiv.remove();
        updateOverallTotal();
    });

    // ✅ prefill data if provided
    if (prefillData) {
        nameInput.value = prefillData.name;
        amountInput.value = prefillData.amount;
        receiptInput.value = prefillData.receipt;
        dateInput.value = prefillData.date;
        updateTitle();
    }

    lonelyDiv.appendChild(title);
    lonelyDiv.appendChild(deductionRow);
    deductionContainer.appendChild(lonelyDiv);
}

// === Save all data to localStorage ===
function getAllDeductionsData() {
    const data = {
        categories: [],
        lonelyDeductions: [],
        overallTotal: 0
    };

    document.querySelectorAll(".category").forEach(categoryDiv => {
        const categoryName = categoryDiv.querySelector(".categoryName").value || "Untitled Category";
        const deductions = [];

        categoryDiv.querySelectorAll(".deductionRow").forEach(row => {
            const inputs = row.querySelectorAll("input");
            const [nameInput, amountInput, receiptInput, dateInput] = inputs;

            deductions.push({
                name: nameInput.value || "",
                amount: parseFloat(amountInput.value) || 0,
                receipt: receiptInput.value || "",
                date: dateInput.value || ""
            });
        });

        const total = deductions.reduce((sum, d) => sum + d.amount, 0);
        data.categories.push({ name: categoryName, total, deductions });
        data.overallTotal += total;
    });

    document.querySelectorAll(".lonelyDeduction .deductionRow").forEach(row => {
        const inputs = row.querySelectorAll("input");
        const [nameInput, amountInput, receiptInput, dateInput] = inputs;

        const deduction = {
            name: nameInput.value || "",
            amount: parseFloat(amountInput.value) || 0,
            receipt: receiptInput.value || "",
            date: dateInput.value || ""
        };
        data.lonelyDeductions.push(deduction);
        data.overallTotal += deduction.amount;
    });

    return data;
}

saveToLocalBtn.addEventListener("click", () => {
    const data = getAllDeductionsData();
    localStorage.setItem("deductionsData", JSON.stringify(data));
    alert("✅ Deductions saved to local storage!");
});

// === Load saved data on page load ===
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("deductionsData");
    if (!saved) return;

    const data = JSON.parse(saved);

    // Rebuild categories
    data.categories.forEach(category => {
        const categoryDiv = createCategory();
        categoryDiv.querySelector(".categoryName").value = category.name;

        const deductionList = categoryDiv.querySelector(".deductionList");
        category.deductions.forEach(d => {
            const row = createDeduction(() => updateCategoryTotal(categoryDiv));
            const inputs = row.querySelectorAll("input");
            inputs[0].value = d.name;
            inputs[1].value = d.amount;
            inputs[2].value = d.receipt;
            inputs[3].value = d.date;
            deductionList.appendChild(row);
        });

        updateCategoryTotal(categoryDiv);
    });

    // Rebuild lonely deductions
    data.lonelyDeductions.forEach(d => createLonelyDeduction(d));

    updateOverallTotal();
});
