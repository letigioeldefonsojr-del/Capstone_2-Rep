
function openModal() {
    document.getElementById("productModal").style.display = "block";
}

// ISARA ANG MODAL POP-UP
function closeModal() {
    document.getElementById("productModal").style.display = "none";
}

E
function saveProduct() {
    const product = document.getElementById("product").value.trim();
    const quantity = document.getElementById("quantity").value.trim();
    const status = document.getElementById("status").value;

   
    if (product === "" || quantity === "") {
        alert("Please fill in all fields.");
        return;
    }


    let statusClass = "";
    if (status === "In Stock") {
        statusClass = "in-stock";
    } else if (status === "Low Stock") {
        statusClass = "low-stock";
    } else {
        statusClass = "urgent-restock";
    }

    const row = `
        <div class="table-row">
            <div>${product}</div>
            <div>${quantity}</div>
            <div>
                <span class="status-badge ${statusClass}">
                    ${status}
                </span>
            </div>
        </div>
    `;

    document
        .getElementById("inventoryBody")
        .insertAdjacentHTML("beforeend", row);

    document.getElementById("product").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("status").selectedIndex = 0;

    closeModal();
}