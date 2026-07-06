// ===========================
// SIDEBAR HOVER-DRAWER CONTROLLER
// Rule: hovering over the sidebar opens the drawer. Moving the
// cursor away from the sidebar closes it again.
// ===========================
(function () {
  const container = document.getElementById('sidebarContainer');
  const leftPanel = document.getElementById('leftPanel');
  const logoutBtn  = document.querySelector('.logout');

  if (!container || !leftPanel) return;

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
})();

// ===========================
// STORE (sample data)
// In a real app this would be populated from your backend/API.
// Replace this block with your real data source.
//
// This seeds ~100 Pending orders (plus a few Processing/Done) to
// prove the table/tabs hold up with a large customer queue.
// ===========================
(function () {
  const firstNames = [
    'Maria', 'Juan', 'Ana', 'Carlo', 'Jose', 'Grace', 'Paolo', 'Liza',
    'Mark', 'Angel', 'Kristine', 'Ramon', 'Bea', 'Miguel', 'Nicole',
    'Andres', 'Camille', 'Ferdinand', 'Sofia', 'Ricardo'
  ];

  const lastNames = [
    'Santos', 'Dela Cruz', 'Reyes', 'Villanueva', 'Garcia', 'Torres',
    'Mendoza', 'Bautista', 'Ramos', 'Flores', 'Aquino', 'Castillo',
    'Navarro', 'Salazar', 'Gonzales', 'Marquez', 'Rivera', 'Domingo'
  ];

  const barangays = [
    'San Isidro', 'Pinagkaisahan', 'Bagumbayan', 'Poblacion',
    'San Roque', 'Malaya', 'Santo Nino', 'Bagong Silang',
    'San Antonio', 'Kaunlaran'
  ];

  const cities = [
    'Quezon City', 'Makati City', 'Pasig City', 'Mandaluyong City',
    'Marikina City', 'Caloocan City', 'Taguig City', 'Pasay City'
  ];

  const menuItems = [
    { name: 'Iced Caramel Latte', price: 150 },
    { name: 'Americano', price: 120 },
    { name: 'Spanish Latte', price: 140 },
    { name: 'Matcha Frappe', price: 165 },
    { name: 'Blueberry Muffin', price: 95 },
    { name: 'Ham & Cheese Sandwich', price: 145 },
    { name: 'Choco Croissant', price: 110 },
    { name: 'Cheesecake Slice', price: 135 },
    { name: 'Fries', price: 89 },
    { name: 'Chicken Wrap', price: 155 }
  ];

  function pick(arr, seed) {
    return arr[seed % arr.length];
  }

  function buildOrder(id, status, dayOffset) {
    const seed = id;
    const customer = `${pick(firstNames, seed)} ${pick(lastNames, seed + 3)}`;
    const address = `${(seed % 90) + 1} ${pick(['Maligaya', 'Kalayaan', 'Masagana', 'Mabini', 'Rizal', 'Bonifacio'], seed + 1)} St., Brgy. ${pick(barangays, seed + 2)}, ${pick(cities, seed + 5)}`;

    const itemCount = (seed % 3) + 1;
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      const menuItem = pick(menuItems, seed + i * 2);
      items.push({
        name: menuItem.name,
        qty: ((seed + i) % 3) + 1,
        price: menuItem.price
      });
    }

    const hour = (seed % 12) + 1;
    const minute = (seed * 7) % 60;
    const ampm = seed % 2 === 0 ? 'AM' : 'PM';

    return {
      id: 1000 + id,
      customer,
      address,
      date: `2026-07-${String((dayOffset % 28) + 1).padStart(2, '0')}`,
      time: `${hour}:${String(minute).padStart(2, '0')} ${ampm}`,
      status,
      items
    };
  }

  const orders = [];
  let nextId = 1;

  // ~100 pending orders — customers who just ordered from their phones.
  for (let i = 0; i < 100; i++) {
    orders.push(buildOrder(nextId, 'pending', nextId));
    nextId++;
  }

  // A handful already being prepared.
  for (let i = 0; i < 6; i++) {
    orders.push(buildOrder(nextId, 'processing', nextId));
    nextId++;
  }

  // A handful already delivered/done.
  for (let i = 0; i < 5; i++) {
    orders.push(buildOrder(nextId, 'done', nextId));
    nextId++;
  }

  window.Store = window.Store || {
    orders,
    getOrderTotal(order) {
      return order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
    }
  };
})();

// ===========================
// PAGE INIT REGISTRY
// (kept so this file matches your existing multi-page pattern)
// ===========================
window.PageInits = window.PageInits || {};

// ===========================
// ORDERS.JS
// ===========================
PageInits.orders = function () {
  // Orders always land on Pending first, so that's the default tab
  // (there is no more "All" tab).
  let currentStatus = 'pending';

  function renderOrders() {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;

    const filtered = Store.orders.filter(order => order.status === currentStatus);

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <div class="empty-state-icon">🛒</div>
              <div class="empty-state-title">No orders found</div>
              <div class="empty-state-desc">No orders in this tab yet.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(order => {
      const total = Store.getOrderTotal(order);

      const statusConfig = {
        pending: {
          cls: 'badge-gold',
          label: 'Pending'
        },
        processing: {
          cls: 'badge-blue',
          label: 'Processing'
        },
        done: {
          cls: 'badge-green',
          label: 'Done'
        }
      }[order.status] || {
        cls: 'badge-gold',
        label: order.status
      };

      return `
        <tr>
          <td>
            <span style="font-family:var(--font-mono);font-weight:600;font-size:0.82rem">
              #${order.id}
            </span>
          </td>

          <td>
            <span style="font-weight:500">
              ${order.customer}
            </span>
          </td>

          <td>
            <span style="font-size:0.82rem;color:var(--text-muted)">
              ${order.date} ${order.time}
            </span>
          </td>

          <td>
            <span style="font-size:0.82rem">
              ${order.items.length} item${order.items.length !== 1 ? 's' : ''}
            </span>
          </td>

          <td>
            <span style="font-family:var(--font-mono);font-weight:700;color:var(--brand-green)">
              ₱${total.toLocaleString()}
            </span>
          </td>

          <td>
            <span class="badge ${statusConfig.cls}">
              ${statusConfig.label}
            </span>
          </td>

          <td>
            <div class="action-buttons">
              <button class="btn-action" data-view="${order.id}">
                View
              </button>

              ${order.status === 'done'
                ? `<button class="btn-action danger" data-delete="${order.id}">Delete</button>`
                : ''
              }
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        openOrderModal(btn.dataset.view);
      });
    });

    tbody.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.delete;

        Store.orders = Store.orders.filter(
          o => String(o.id) !== String(orderId)
        );

        updateTabCounts();
        renderOrders();
      });
    });
  }

  function openOrderModal(orderId) {
    const order = Store.orders.find(
      o => String(o.id) === String(orderId)
    );

    if (!order) return;

    const modal = document.getElementById('order-detail-modal');
    const title = document.getElementById('order-modal-title');
    const body = document.getElementById('order-modal-body');

    if (!modal || !title || !body) return;

    title.textContent = `Order #${order.id}`;

    const total = Store.getOrderTotal(order);

    const statusClass = {
      pending: 'badge-gold',
      processing: 'badge-blue',
      done: 'badge-green'
    }[order.status] || 'badge-gold';

    const statusLabel =
      order.status.charAt(0).toUpperCase() +
      order.status.slice(1);

    body.innerHTML = `
      <div class="order-detail-info">

        <div class="detail-field">
          <span class="detail-label">Customer</span>
          <span class="detail-value">${order.customer}</span>
        </div>

        <div class="detail-field">
          <span class="detail-label">Date & Time</span>
          <span class="detail-value">
            ${order.date} at ${order.time}
          </span>
        </div>

        <div class="detail-field">
          <span class="detail-label">Status</span>
          <span class="detail-value">
            <span class="badge ${statusClass}">
              ${statusLabel}
            </span>
          </span>
        </div>

        <div class="detail-field">
          <span class="detail-label">Order ID</span>
          <span class="detail-value" style="font-family:var(--font-mono)">
            #${order.id}
          </span>
        </div>

        <div class="detail-field" style="grid-column: 1 / -1;">
          <span class="detail-label">Delivery Address</span>
          <span class="detail-value">${order.address || 'No address provided'}</span>
        </div>

      </div>

      <table class="order-items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td style="font-family:var(--font-mono)">
                ${item.qty}
              </td>
              <td style="font-family:var(--font-mono)">
                ₱${item.price}
              </td>
              <td style="font-family:var(--font-mono);font-weight:600">
                ₱${(item.qty * item.price).toLocaleString()}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="order-total-row">
        <span class="order-total-label">
          Total Amount
        </span>

        <span class="order-total-value">
          ₱${total.toLocaleString()}
        </span>
      </div>
    `;

    const actionBtn = document.getElementById('order-modal-complete');

    if (actionBtn) {
      // Pending -> Processing -> Done. Once an order is Done there's
      // nothing further to advance, so the button is hidden.
      const nextStep = {
        pending: { label: 'Processing', next: 'processing' },
        processing: { label: 'Complete', next: 'done' }
      }[order.status];

      if (nextStep) {
        actionBtn.style.display = '';
        actionBtn.textContent = nextStep.label;

        actionBtn.onclick = () => {
          order.status = nextStep.next;

          modal.classList.remove('open');

          updateTabCounts();
          renderOrders();
        };
      } else {
        actionBtn.style.display = 'none';
      }
    }

    modal.classList.add('open');
  }

  function updateTabCounts() {
    document.querySelectorAll('.status-tab').forEach(tab => {
      const status = tab.dataset.status;

      const count = Store.orders.filter(
        order => order.status === status
      ).length;

      const countEl = tab.querySelector('.tab-count');

      if (countEl) {
        countEl.textContent = count;
      }
    });

    const pendingCount =
      Store.orders.filter(order =>
        order.status === 'pending'
      ).length;

    const badge = document.getElementById('order-badge');

    if (badge) {
      badge.textContent = pendingCount;
    }
  }

  document.querySelectorAll('.status-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document
        .querySelectorAll('.status-tab')
        .forEach(t => t.classList.remove('active'));

      tab.classList.add('active');

      currentStatus = tab.dataset.status;

      renderOrders();
    });
  });

  document.getElementById('order-modal-close')
    ?.addEventListener('click', () => {
      document
        .getElementById('order-detail-modal')
        ?.classList.remove('open');
    });

  document.getElementById('order-modal-cancel')
    ?.addEventListener('click', () => {
      document
        .getElementById('order-detail-modal')
        ?.classList.remove('open');
    });

  document.getElementById('order-detail-modal')
    ?.addEventListener('click', e => {
      if (e.target === e.currentTarget) {
        e.currentTarget.classList.remove('open');
      }
    });

  updateTabCounts();
  renderOrders();
};

// ===========================
// BOOT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  PageInits.orders();
});