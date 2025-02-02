function loadSales() {
    let salesData = JSON.parse(localStorage.getItem("salesData")) || {};
    let selectedDate = document.getElementById("date-filter").value;
    let tableBody = document.getElementById("sales-records");
    tableBody.innerHTML = "";

    let itemCounts = {};  // Object to store item sales count

    if (salesData[selectedDate]) {
        salesData[selectedDate].forEach(record => {
            tableBody.innerHTML += `
                <tr>
                    <td>${record.date}</td>
                    <td>${record.billNumber}</td>
                    <td>$${record.grandTotal}</td>
                </tr>
            `;

            // Count item quantities for the graph
            record.items.forEach(item => {
                if (itemCounts[item.name]) {
                    itemCounts[item.name] += item.quantity;
                } else {
                    itemCounts[item.name] = item.quantity;
                }
            });
        });
    }

    updateGraph(Object.keys(itemCounts), Object.values(itemCounts));
}

function updateGraph(labels, data) {
    let ctx = document.getElementById("salesChart").getContext("2d");
    if (window.salesChartInstance) {
        window.salesChartInstance.destroy();
    }
    window.salesChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels, // Item names
            datasets: [{
                label: "Number of Items Sold",
                data: data, // Number of times each item is sold
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Automatically set today's date on page load
document.addEventListener("DOMContentLoaded", () => {
    let today = new Date().toISOString().split("T")[0];
    document.getElementById("date-filter").value = today;
    loadSales();
});