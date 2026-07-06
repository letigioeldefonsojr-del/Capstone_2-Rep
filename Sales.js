// sales.js

document.addEventListener('DOMContentLoaded', () => {

    // ================= SIDEBAR DRAWER (open on hover, close on leave) =================
    const container = document.getElementById('sidebarContainer');
    const leftPanel = document.getElementById('leftPanel');
    const logoutBtn = document.querySelector('.logout');

    leftPanel.addEventListener('mouseenter', () => {
        container.classList.add('drawer-open');
    });

    leftPanel.addEventListener('mouseleave', () => {
        container.classList.remove('drawer-open');
    });

    // ================= SALES LINE CHART =================
    const ctx = document.getElementById('salesLineChart').getContext('2d');
    const selector = document.getElementById('timeframeSelector');

    // Sample datasets for each timeframe
    const salesData = {
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [4000, 3200, 5100, 4800, 6200, 8900, 7600]
        },
        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [9000, 10500, 8700, 11800]
        },
        yearly: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            data: [6000, 7200, 6800, 9000, 8500, 9700, 10200, 9800, 11000, 10500, 11800, 12500]
        }
    };

    // Populate dropdown
    const timeframes = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
    ];

    timeframes.forEach(tf => {
        const opt = document.createElement('option');
        opt.value = tf.value;
        opt.textContent = tf.label;
        selector.appendChild(opt);
    });

    selector.value = 'weekly'; // default view

    // Gradient fill for the line
    function getGradient(ctx, area) {
        const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
        gradient.addColorStop(0, 'rgba(64, 134, 13, 0.35)');
        gradient.addColorStop(1, 'rgba(64, 134, 13, 0)');
        return gradient;
    }

    let salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.weekly.labels,
            datasets: [{
                label: 'Sales (₱)',
                data: salesData.weekly.data,
                borderColor: '#093a20',
                borderWidth: 3,
                pointBackgroundColor: '#40860d',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.35,
                fill: true,
                backgroundColor: (context) => {
                    const { ctx, chartArea } = context.chart;
                    if (!chartArea) return null;
                    return getGradient(ctx, chartArea);
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#093a20',
                    titleFont: { weight: '700' },
                    bodyFont: { weight: '600' },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (item) => `₱ ${item.raw.toLocaleString()}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#374151', font: { weight: '600' } }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: {
                        color: '#374151',
                        font: { weight: '600' },
                        callback: (value) => `₱${value.toLocaleString()}`
                    }
                }
            }
        }
    });

    // Update chart when timeframe changes
    selector.addEventListener('change', () => {
        const selected = salesData[selector.value];
        salesChart.data.labels = selected.labels;
        salesChart.data.datasets[0].data = selected.data;
        salesChart.update();
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
        window.location.href = 'Index.html';
    });
    }

});