import { updateWithDeductions } from './calculate.js';

const deductionContainer = document.getElementById("deductionContainer");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const addLonelyDeductionBtn = document.getElementById("addLonelyDeductionBtn");
const overallTotalDisplay = document.getElementById("overallTotal");
const saveToLocalBtn = document.getElementById("saveToLocalBtn");

// === Helper: format number with commas ===
function formatNumber(num) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Format date to Australian style: DD/MM/YYYY
function formatDateAU(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}

// Convert AU format (DD/MM/YYYY) to ISO (YYYY-MM-DD)
function auToIsoDate(auDate) {
    if (!auDate) return "";
    const parts = auDate.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// Convert ISO (YYYY-MM-DD) to AU (DD/MM/YYYY)
function isoToAuDate(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
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
    updateWithDeductions(total);
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
            <span class="collapseIcon">▼</span>
            <button class="addDeductionBtn">+ Deduction</button>
            <button class="removeCategoryBtn">✖</button>
        </div>
        <div class="deductionList"></div>
        <div class="categoryTotal">Total: $<span>0.00</span></div>
    `;

    const addDeductionBtn = categoryDiv.querySelector(".addDeductionBtn");
    const removeCategoryBtn = categoryDiv.querySelector(".removeCategoryBtn");
    const deductionList = categoryDiv.querySelector(".deductionList");
    const header = categoryDiv.querySelector(".categoryHeader");
    const titleInput = categoryDiv.querySelector(".categoryName");

    // === Stop input clicks from toggling collapse ===
    titleInput.addEventListener("click", (e) => e.stopPropagation());
    titleInput.addEventListener("focus", (e) => e.stopPropagation());
    titleInput.addEventListener("mousedown", (e) => e.stopPropagation()); // optional for some browsers

    // === Collapse toggle on header click (excluding buttons & input) ===
    header.addEventListener("click", (e) => {
        if (!e.target.closest("button") && !e.target.closest("input")) {
            categoryDiv.classList.toggle("collapsed");
        }
    });

    addDeductionBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent header toggle
        deductionList.appendChild(createDeduction(() => updateCategoryTotal(categoryDiv)));
        updateCategoryTotal(categoryDiv);
        updateOverallTotal();
    });

    removeCategoryBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent header toggle
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
    return categoryDiv;
}



// === Create a lonely deduction ===
function createLonelyDeduction(prefillData = null) {
    const lonelyDiv = document.createElement("div");
    lonelyDiv.classList.add("lonelyDeduction");

    // Header (title + remove button)
    const header = document.createElement("div");
    header.classList.add("lonelyHeader");
    header.innerHTML = `
        <h3 class="lonelyTitle">Lonely Deduction</h3>
        <button class="removeLonelyBtn removeCategoryBtn">✖</button>
    `;

    const deductionRow = createDeduction(() => updateOverallTotal());
    const nameInput = deductionRow.querySelector('input[type="text"]');
    const amountInput = deductionRow.querySelector('input[type="number"]');
    const receiptInput = deductionRow.querySelectorAll("input")[2];
    const dateInput = deductionRow.querySelectorAll("input")[3];

    // Hide the inner remove button (from the single deduction row)
    const innerRemoveBtn = deductionRow.querySelector(".removeDeductionBtn");
    if (innerRemoveBtn) innerRemoveBtn.style.display = "none";


    const title = header.querySelector(".lonelyTitle");
    const removeLonelyBtn = header.querySelector(".removeLonelyBtn");

    function updateTitle() {
        const name = nameInput.value || "Lonely Deduction";
        const amount = parseFloat(amountInput.value) || 0;
        title.textContent = `${name} - $${formatNumber(amount)}`;
    }

    nameInput.addEventListener("input", updateTitle);
    amountInput.addEventListener("input", updateTitle);

    removeLonelyBtn.addEventListener("click", () => {
        lonelyDiv.remove();
        updateOverallTotal();
    });

    // ✅ Prefill data if provided
    if (prefillData) {
        nameInput.value = prefillData.name;
        amountInput.value = prefillData.amount;
        receiptInput.value = prefillData.receipt;
        dateInput.value = prefillData.date;
        updateTitle();
    }

    lonelyDiv.appendChild(header);
    lonelyDiv.appendChild(deductionRow);
    deductionContainer.appendChild(lonelyDiv);
}



// === Save all data to localStorage
export function getAllDeductionsData() {
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

            let dateValue = dateInput.value ? new Date(dateInput.value) : null;
            deductions.push({
                name: nameInput.value || "",
                amount: parseFloat(amountInput.value) || 0,
                receipt: receiptInput.value || "",
                date: dateValue ? dateValue.toISOString().split("T")[0] : "" // YYYY-MM-DD
            });
        });

        const total = deductions.reduce((sum, d) => sum + d.amount, 0);
        data.categories.push({ name: categoryName, total, deductions });
        data.overallTotal += total;
    });

    document.querySelectorAll(".lonelyDeduction .deductionRow").forEach(row => {
        const inputs = row.querySelectorAll("input");
        const [nameInput, amountInput, receiptInput, dateInput] = inputs;

        let dateValue = dateInput.value ? new Date(dateInput.value) : null;
        const deduction = {
            name: nameInput.value || "",
            amount: parseFloat(amountInput.value) || 0,
            receipt: receiptInput.value || "",
            date: dateValue ? dateValue.toISOString().split("T")[0] : ""
        };
        data.lonelyDeductions.push(deduction);
        data.overallTotal += deduction.amount;
    });

    return data;
}

// === Save button handler ===
saveToLocalBtn.addEventListener("click", () => {
    const data = getAllDeductionsData();
    localStorage.setItem("deductionsData", JSON.stringify(data));
    alert("✅ Deductions saved to local storage!");
});


// === Load saved data on page load ===
window.addEventListener("DOMContentLoaded", () => {
    // --- Existing load logic ---
    const saved = localStorage.getItem("deductionsData");
    if (saved) {
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
    }

    // --- ✅ Attach button event listeners here ---
    document.getElementById("addCategoryBtn").addEventListener("click", createCategory);
    document.getElementById("addLonelyDeductionBtn").addEventListener("click", () => createLonelyDeduction());
});

const clearLocalBtn = document.getElementById("clearLocalBtn");

clearLocalBtn.addEventListener("click", () => {
    const confirmClear = confirm("Are you sure you want to clear all saved deductions?");
    if (!confirmClear) return;

    localStorage.removeItem("deductionsData");  // Remove from local storage
    alert("✅ All saved deductions cleared!");

    // Optional: clear the UI
    deductionContainer.innerHTML = "";
    updateOverallTotal();
});

window.getAllDeductionsData = getAllDeductionsData;




