console.log("Save XLSX loaded");

const saveXlsxBtn = document.getElementById("saveCsvBtn");

saveXlsxBtn.addEventListener("click", () => {
    console.log("Save XLSX clicked");

    if (!window.getAllDeductionsData) return alert("Deductions data not found!");
    const data = getAllDeductionsData();
    localStorage.setItem("deductionsData", JSON.stringify(data));

    const wb = XLSX.utils.book_new();
    const wsData = [];

    // ===== Build top rows =====
    wsData.push(["TAXPERT SUMMARY"]); // Row 0
    wsData.push(["Yash Kishore | yashkishore132@gmail.com"]); // Row 1
    wsData.push([]); // Row 2 empty space

    // Helper to format AU date
    const formatDateAU = (dateStr) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    };

    // Categories
    data.categories.forEach(cat => {
        wsData.push([cat.name.toUpperCase()]);
        wsData.push(["Deduction", "Amount ($)", "Receipt #", "Date (DD/MM/YYYY)"]);
        cat.deductions.forEach(d => {
            wsData.push([
                d.name || "-",
                parseFloat(d.amount) || 0,
                d.receipt || "-",
                formatDateAU(d.date) || "-"
            ]);
        });
        wsData.push(["Total", parseFloat(cat.total) || 0, "", ""]);
        wsData.push([]);
    });

    // Lonely deductions
    if (data.lonelyDeductions.length > 0) {
        wsData.push(["UNCATEGORISED"]);
        wsData.push(["Deduction", "Amount ($)", "Receipt #", "Date (DD/MM/YYYY)"]);
        data.lonelyDeductions.forEach(d => {
            wsData.push([
                d.name || "-",
                parseFloat(d.amount) || 0,
                d.receipt || "-",
                formatDateAU(d.date) || "-"
            ]);
        });
        const lonelyTotal = data.lonelyDeductions.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
        wsData.push(["Total", lonelyTotal, "", ""]);
        wsData.push([]);
    }

    // Overall total
    wsData.push(["Overall Total", parseFloat(data.overallTotal) || 0, "", ""]);

    // ===== Create worksheet =====
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Merge top rows
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title A1:D1
        { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }  // Author/email A2:D2
    ];

    // ===== Apply styles =====
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 0; R <= range.e.r; ++R) {
        for (let C = 0; C <= range.e.c; ++C) {
            const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = ws[cell_address];
            if (!cell) continue;

            cell.s = cell.s || {};

            // Title
            if (R === 0) {
                cell.s = {
                    font: { bold: true, sz: 18, color: { rgb: "006400" } },
                    alignment: { horizontal: "center" }
                };
            }

            // Author/email
            if (R === 1) {
                cell.s = {
                    font: { italic: true, sz: 12, color: { rgb: "000000" } },
                    alignment: { horizontal: "center" }
                };
            }

            // Uppercase category/uncategorized titles
            if (wsData[R][0] && wsData[R][0] === wsData[R][0].toUpperCase() && R > 2 && wsData[R][0] !== "TOTAL") {
                cell.s = {
                    font: { bold: true, sz: 14, color: { rgb: "228B22" } }
                };
            }

            // Table headers
            if (wsData[R][0] === "Deduction") {
                cell.s = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: "C6EFCE" } },
                    alignment: { horizontal: "center" }
                };
            }

            // Totals
            if (typeof wsData[R][0] === "string" && wsData[R][0].toLowerCase().includes("total")) {
                cell.s = {
                    font: { bold: true, color: { rgb: "000080" } },
                    fill: { fgColor: { rgb: "FFFF99" } },
                    alignment: { horizontal: "right" }
                };
            }

            // Right-align numeric values
            if (C === 1 && typeof cell.v === "number") {
                cell.s.alignment = { horizontal: "right" };
            }
        }
    }

    // ===== Set column widths =====
    ws['!cols'] = [
        { wch: 30 }, // Deduction Name
        { wch: 14 }, // Amount
        { wch: 16 }, // Receipt #
        { wch: 22 }  // Date (expanded)
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Deductions");
    XLSX.writeFile(wb, "Taxpert_Deductions.xlsx");
});
