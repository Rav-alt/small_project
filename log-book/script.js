
const PRICES = {
    galloon: 40,
    liter6: 15,
    liter8: 18,
    liter10: 20
};

// Get today date (YYYY-MM-DD)
const today = new Date().toISOString().split("T")[0];

// Load all history
let history = JSON.parse(localStorage.getItem("history")) || {};

// Ensure today exists
if (!history[today]) {
    history[today] = { logs: [] };
}

let logs = history[today].logs;

// Add transaction
function addEntry() {
    const customer = document.getElementById("customer").value.trim();
    const galloonType = document.getElementById("galloonType").value;
    const galloonQty = Number(document.getElementById("galloonQty").value || 0);

    const liter6 = Number(document.getElementById("liter6").value || 0);
    const liter8 = Number(document.getElementById("liter8").value || 0);
    const liter10 = Number(document.getElementById("liter10").value || 0);

    const galloonTotal = galloonQty * PRICES.galloon;
    const litersTotal =
        (liter6 * PRICES.liter6) +
        (liter8 * PRICES.liter8) +
        (liter10 * PRICES.liter10);

    const total = galloonTotal + litersTotal;

    if (!customer || total === 0) {
        alert("Please enter valid transaction details.");
        return;
    }

    let literDetails = [];
    if (liter6 > 0) literDetails.push(`6L x${liter6}`);
    if (liter8 > 0) literDetails.push(`8L x${liter8}`);
    if (liter10 > 0) literDetails.push(`10L x${liter10}`);

    logs.push({
        customer,
        galloon: galloonType ? `${galloonType} x${galloonQty}` : "-",
        liters: literDetails.length ? literDetails.join(", ") : "-",
        galloonTotal,
        litersTotal,
        total
    });

    saveHistory();
    renderTable();
    clearInputs();
}

// Save all history
function saveHistory() {
    history[today].logs = logs;
    localStorage.setItem("history", JSON.stringify(history));
}

// Render table + summary
function renderTable(selectedDate = today) {
    const tbody = document.querySelector("#logTable tbody");
    tbody.innerHTML = "";

    let gTotal = 0;
    let lTotal = 0;
    let grand = 0;

    const dayLogs = history[selectedDate]?.logs || [];

    dayLogs.forEach(log => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${log.customer}</td>
            <td>${log.galloon}</td>
            <td>${log.liters}</td>
            <td>₱${log.galloonTotal}</td>
            <td>₱${log.litersTotal}</td>
            <td>₱${log.total}</td>
        `;

        gTotal += log.galloonTotal;
        lTotal += log.litersTotal;
        grand += log.total;
    });

    document.getElementById("summary").innerHTML = `
        <span>Galloon Total</span>: ₱${gTotal}<br>
        <span>Liter Total</span>: ₱${lTotal}<br><br>
        <strong>Grand Total: ₱${grand}</strong>
    `;
}

// Load date history
function loadHistory(date) {
    logs = history[date]?.logs || [];
    renderTable(date);
}

// End day
function clearDay() {
    alert("Day ended. Tomorrow will start a new record.");
}

// Clear inputs
function clearInputs() {
    document.querySelectorAll("input").forEach(i => i.value = "");
    document.getElementById("galloonType").value = "";
}

// Populate date selector
function loadDateOptions() {
    const select = document.getElementById("historyDate");
    select.innerHTML = "";

    Object.keys(history).sort().reverse().forEach(date => {
        const option = document.createElement("option");
        option.value = date;
        option.textContent = date;
        select.appendChild(option);
    });
}

// Initial load
loadDateOptions();
renderTable();
