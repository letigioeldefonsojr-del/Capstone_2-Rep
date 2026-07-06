const STORAGE_KEY = 'sharedInventory';

function loadInventory() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderNotifications() {
    const inventory = loadInventory();

    const urgentItems = inventory.filter(p => p.status === 'Urgent Restock');
    const inStockItems = inventory.filter(p => p.status === 'In Stock');

    document.getElementById('urgentCount').textContent = urgentItems.length;
    document.getElementById('inStockCount').textContent = inStockItems.length;

    renderList('urgentList', urgentItems, 'urgent', 'No urgent restocks right now.');
    renderList('inStockList', inStockItems, 'in-stock', 'No items currently in stock.');
}

function renderList(containerId, items, typeClass, emptyMessage) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = `<div class="notif-empty">${emptyMessage}</div>`;
        return;
    }

    const frag = document.createDocumentFragment();
    items.forEach(item => {
        const el = document.createElement('div');
        el.className = `notif-item ${typeClass}`;
        el.innerHTML = `
            <div class="item-info">
                <span class="item-name">${escapeHtml(item.product)}</span>
                <span class="item-category">${escapeHtml(item.category || '—')}</span>
            </div>
            <div class="item-qty">${item.quantity} pcs</div>
        `;
        frag.appendChild(el);
    });
    container.appendChild(frag);
}

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

    

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'Index.html';
        });
    }

    renderNotifications();
});

// Auto-refresh if Inventory page updates data in another open tab/window
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        renderNotifications();
    }
});

