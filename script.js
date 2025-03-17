// filepath: /home/bhavya/Documents/projects/billing_software/billing/script.js
function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

let items = [
    { id: 1, name: "Alu Masala Toasted", price: 40 },
    { id: 2, name: "Alu Butter Toasted", price: 40 },
    { id: 3, name: "Veg Three Slices", price: 50 },
    { id: 4, name: "Veg Toasted", price: 50 },
    { id: 5, name: "Masala Veg Toasted", price: 50 },
    { id: 6, name: "Veg Three Slices with Cheese", price: 70 },
    { id: 7, name: "Veg Double Cheese Sandwich", price: 80 },
    { id: 8, name: "Masala Veg Toasted with Cheese", price: 80 },
    { id: 9, name: "Sezwan Garlic Toasted", price: 60 },
    { id: 10, name: "Sezwan Garlic Toasted with Cheese", price: 90 },
    { id: 11, name: "Garlic Cheese Brust", price: 90 },
    { id: 12, name: "Green Chilli Cheese", price: 90 },
    { id: 13, name: "Wafer's Cheese with Veg Sandwich", price: 90 },
    { id: 14, name: "Veg Cheese Grilled", price: 90 },
    { id: 15, name: "Pizza Cheese Sandwich", price: 90 },
    { id: 16, name: "Mayonise with Cheese", price: 90 },
    { id: 17, name: "Panner Tikka Cheese", price: 90 },
    { id: 18, name: "Peanut Corn Cheese", price: 90 },
    { id: 19, name: "Maxican Chilli Cheese", price: 90 },
    { id: 20, name: "Italian Pasta Cheese", price: 90 },
    { id: 21, name: "Garlic Bread", price: 80 },
    { id: 22, name: "Bread Butter", price: 20 },
    { id: 23, name: "Butter Jam", price: 30 },
    { id: 24, name: "Chocolate Bread", price: 40 },
    { id: 25, name: "Chocolate Cheese Bread", price: 60 },
    { id: 26, name: "Jam Cheese", price: 60 },
    { id: 27, name: "Pineapple Chocolate Cheese", price: 80 },
    { id: 28, name: "Margreta Cheese Pizza", price: 100 },
    { id: 29, name: "Margreta Brust Cheese Pizza", price: 120 },
    { id: 30, name: "Veg Cheese Pizza", price: 120 },
    { id: 31, name: "Italian Cheese Pizza", price: 140 },
    { id: 32, name: "Italian Pasta Cheese Pizza", price: 160 },
    { id: 33, name: "Veg Thick Crushed Cheese Pizza", price: 140 },
    { id: 34, name: "American Corn Cheese Pizza", price: 160 },
    { id: 35, name: "Sezwan Garlic Cheese Pizza", price: 160 },
    { id: 36, name: "Panner Tikka Cheese Pizza", price: 170 },
    { id: 37, name: "Maxican Cheese Pizza", price: 170 },
    { id: 38, name: "Wafers Cheese Pizza", price: 170 },
    { id: 39, name: "Chocolate Cheese Pizza", price: 170 },
    { id: 40, name: "Madhav Spe. Cheese Pizza", price: 200 },
    { id: 41, name: "Veg Burger", price: 70 },
    { id: 42, name: "Veg Double Cheese Burger", price: 80 },
    { id: 43, name: "American Corn Burger", price: 80 },
    { id: 44, name: "Veg Crispy Cheese Burger", price: 80 },
    { id: 45, name: "Sezwan Garlic Burger", price: 80 },
    { id: 46, name: "Panner King Burger", price: 80 }
];

let bill = [];
let salesData = JSON.parse(localStorage.getItem("salesData")) || {};
let billNumber = parseInt(localStorage.getItem("billNumber")) || 1;

function loadMenu() {
    const menu = document.getElementById("menu-items");
    menu.innerHTML = "";
    items.forEach(item => {
        menu.innerHTML += `
            <div class="item-card" data-id="${item.id}" onclick="addToBill(${item.id})">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">₹${item.price}</p>
                </div>
            </div>
        `;
    });
}

function addToBill(id) {
    let item = items.find(i => i.id === id);
    let billItem = bill.find(i => i.id === id);

    if (billItem) {
        billItem.quantity++;
    } else {
        bill.push({ ...item, quantity: 1 });
    }
    let clickedItem = document.querySelector(`.item-card[data-id="${id}"]`);
    if (clickedItem) {
        clickedItem.classList.add("clicked");
        setTimeout(() => {
            clickedItem.classList.remove("clicked");
        }, 100);
    }
    updateBill();
}

function updateBill() {
    const billTable = document.getElementById("bill-items");
    const grandTotalEl = document.getElementById("grand-total");
    let grandTotal = 0;

    billTable.innerHTML = "";
    bill.forEach(item => {
        let total = item.price * item.quantity;
        grandTotal += total;
        billTable.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity} <button class="btn btn-warning btn-sm" onclick="decreaseQuantity(${item.id})">-</button></td>
                <td>₹${item.price}</td>
                <td>₹${total}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeItem(${item.id})">Remove</button></td>
            </tr>
        `;
    });
    grandTotalEl.innerText = grandTotal;
}

function decreaseQuantity(id) {
    let billItem = bill.find(i => i.id === id);
    if (billItem && billItem.quantity > 1) {
        billItem.quantity--;
    } else {
        removeItem(id);
    }
    updateBill();
}

function removeItem(id) {
    bill = bill.filter(i => i.id !== id);
    updateBill();
}

function printBill() {
    let date = new Date().toISOString().split("T")[0];
    let grandTotal = document.getElementById("grand-total").innerText;

    if (!salesData[date]) salesData[date] = [];
    salesData[date].push({
        billNumber: billNumber.toString().padStart(4, '0'),
        grandTotal,
        date,
        items: [...bill]
    });
    localStorage.setItem("salesData", JSON.stringify(salesData));
    localStorage.setItem("billNumber", ++billNumber);

    let printContent = `
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
            h2, h4 { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid black; padding: 10px; text-align: center; }
            th { background-color: #007bff; color: white; }
            tfoot td { font-weight: bold; }
        </style>
        <h2>Madhav Sandwich & Pizza's</h2>
        <h4>Bill No: ${billNumber.toString().padStart(4, '0')}</h4>
        <h4>Date: ${date}</h4>
        <table>
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price (₹)</th>
                </tr>
            </thead>
            <tbody>`;

    bill.forEach(item => {
        printContent += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price * item.quantity}</td>
                </tr>`;
    });

    printContent += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2"><strong>Total</strong></td>
                    <td>₹${grandTotal}</td>
                </tr>
            </tfoot>
        </table>`;

    let blob = new Blob([printContent], { type: "text/html" });
    let fileHandle = document.createElement("a");
    fileHandle.href = URL.createObjectURL(blob);
    fileHandle.download = `Bill_${billNumber.toString().padStart(4, '0')}.html`;
    document.body.appendChild(fileHandle);
    fileHandle.click();
    document.body.removeChild(fileHandle);

    let printWindow = window.open("", "", "width=600,height=400");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();

    bill = [];
    updateBill();
}


document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
    salesData = JSON.parse(localStorage.getItem("salesData")) || {};
});