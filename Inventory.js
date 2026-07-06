// ===================== SHARED STORAGE =====================
const STORAGE_KEY = 'sharedInventory';

function loadProducts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// ===================== DATA STORE =====================
// Each product: { id, product, category, quantity, status }
let products = loadProducts();
let filteredIndexes = []; // indexes into `products`, in display order

const ROW_HEIGHT = 50;
let nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;

// ===================== STATUS LOGIC =====================
function getStatus(qty) {
    return qty <= 20 ? 'Urgent Restock' : 'In Stock';
}

function statusClass(status) {
    return status === 'Urgent Restock' ? 'urgent-restock' : 'in-stock';
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===================== DUPLICATE CHECK =====================
function isDuplicate(name) {
    const normalized = name.trim().toLowerCase();
    return products.some(p => p.product.trim().toLowerCase() === normalized);
}

// ===================== DOM REFS =====================
const tableContainer = document.getElementById('inventoryTable');
const spacer = document.getElementById('bodySpacer');
const inventoryBody = document.getElementById('inventoryBody');
const searchInput = document.querySelector('.search-input');
const modal = document.getElementById('productModal');
const productInput = document.getElementById('product');
const categoryInput = document.getElementById('category');
const quantityInput = document.getElementById('quantity');


// ===================== FILTER + RANK (best match on top) =====================
function applyFilter() {
    const term = searchInput.value.trim().toLowerCase();

    if (!term) {
        filteredIndexes = products.map((_, i) => i);
    } else {
        const matches = [];
        for (let i = 0; i < products.length; i++) {
            const name = products[i].product.toLowerCase();
            const category = products[i].category.toLowerCase();

            let score = -1;
            if (name === term) score = 4;
            else if (name.startsWith(term)) score = 3;
            else if (name.includes(term)) score = 2;
            else if (category.includes(term)) score = 1;

            if (score > -1) matches.push({ index: i, score });
        }
        matches.sort((a, b) => b.score - a.score);
        filteredIndexes = matches.map(m => m.index);
    }

    spacer.style.height = (filteredIndexes.length * ROW_HEIGHT) + 'px';
    renderVisible();
}

// ===================== VIRTUAL SCROLL RENDERING =====================
function renderVisible() {
    const scrollTop = tableContainer.scrollTop;
    const viewHeight = tableContainer.clientHeight;

    const buffer = 5;
    const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - buffer);
    const endIdx = Math.min(
        filteredIndexes.length,
        Math.ceil((scrollTop + viewHeight) / ROW_HEIGHT) + buffer
    );

    inventoryBody.style.transform = `translateY(${startIdx * ROW_HEIGHT}px)`;
    inventoryBody.innerHTML = '';

    if (filteredIndexes.length === 0) {
        inventoryBody.innerHTML = `<div class="no-results">No products found.</div>`;
        return;
    }

    const frag = document.createDocumentFragment();
    for (let i = startIdx; i < endIdx; i++) {
        const p = products[filteredIndexes[i]];
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div>${escapeHtml(p.product)}</div>
            <div>${escapeHtml(p.category)}</div>
            <div>${p.quantity}</div>
            <div><span class="status-badge ${statusClass(p.status)}">${p.status}</span></div>
            <div><button class="delete-btn" data-id="${p.id}" title="Delete">🗑</button></div>
        `;
        frag.appendChild(row);
    }
    inventoryBody.appendChild(frag);
}

tableContainer.addEventListener('scroll', () => {
    window.requestAnimationFrame(renderVisible);
});

let searchDebounce;
searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(applyFilter, 150);
});

// Delete button (event delegation, works for all virtual rows)
inventoryBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-btn');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const item = products.find(p => p.id === id);
    if (!item) return;

    const confirmDelete = confirm(`Delete "${item.product}"? This cannot be undone.`);
    if (!confirmDelete) return;

    products = products.filter(p => p.id !== id);
    saveProducts();
    applyFilter();
});

// ===================== MODAL =====================
function openModal() {
    productInput.value = '';
    categoryInput.value = '';
    quantityInput.value = '';
    modal.style.display = 'block';
    productInput.focus();
}

function closeModal() {
    modal.style.display = 'none';
}

function saveProduct() {
    const name = productInput.value.trim();
    const category = categoryInput.value.trim();
    const qty = parseInt(quantityInput.value, 10);

    if (!name) {
        alert('Please enter a product name.');
        return;
    }
    if (!category) {
        alert('Please enter a category.');
        return;
    }
    if (isNaN(qty) || qty < 0) {
        alert('Please enter a valid quantity (0 or higher).');
        return;
    }
    if (isDuplicate(name)) {
        alert(`"${name}" already exists in the inventory. Please use a different name or edit the existing item.`);
        return;
    }

    const status = getStatus(qty);
    products.push({ id: nextId++, product: name, category, quantity: qty, status });
    saveProducts();

    closeModal();
    searchInput.value = '';
    applyFilter();
}

document.getElementById('addBtn').addEventListener('click', openModal);
document.getElementById('saveBtn').addEventListener('click', saveProduct);
document.getElementById('cancelBtn').addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// ===================== SIDEBAR DRAWER (open on hover, close on leave) =====================
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('sidebarContainer');
    const leftPanel = document.getElementById('leftPanel');
    const logoutBtn  = document.querySelector('.logout');

    leftPanel.addEventListener('mouseenter', () => {
        container.classList.add('drawer-open');
    });

    leftPanel.addEventListener('mouseleave', () => {
        container.classList.remove('drawer-open');
    });
    
    applyFilter();

        if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'Index.html';
        });
    }
});