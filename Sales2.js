// Sales2.js

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

    // ================= SALES BAR CHART =================
    const chartElement = document.getElementById('salesBarChart').getContext('2d');
    const dropdownMenu = document.getElementById('timeframeSelector');

    // Sample datasets for each timeframe
    const graphDataOptions = {
        weekly: {
            label: 'Weekly',
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [22, 18, 30, 27, 35, 48, 41]
        },
        monthly: {
            label: 'Monthly',
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [38, 45, 33, 52]
        },
        yearly: {
            label: 'Yearly',
            labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            data: [25, 30, 28, 35, 33, 40, 42, 38, 45, 41, 48, 50]
        }
    };

    // Populate dropdown
    let dropdownHTMLContent = '';
    Object.keys(graphDataOptions).forEach(key => {
        dropdownHTMLContent += `<option value="${key}">${graphDataOptions[key].label}</option>`;
    });
    dropdownMenu.innerHTML = dropdownHTMLContent;

    const defaultKey = 'weekly';
    const defaultDataset = graphDataOptions[defaultKey];
    dropdownMenu.value = defaultKey;

    const salesChart = new Chart(chartElement, {
        type: 'bar',
        data: {
            labels: defaultDataset.labels,
            datasets: [{
                data: defaultDataset.data,
                backgroundColor: '#4285f4',
                borderRadius: 6,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#093a20',
                        font: {
                            size: 14,
                            weight: '700'
                        }
                    }
                },
                y: {
                    min: 0,
                    max: 60,
                    ticks: {
                        stepSize: 10,
                        color: '#093a20',
                        font: {
                            size: 15,
                            weight: '700'
                        }
                    },
                    grid: {
                        color: 'rgba(9, 58, 32, 0.15)',
                        lineWidth: 1
                    }
                }
            }
        }
    });

    dropdownMenu.addEventListener('change', (event) => {
        const selectedKey = event.target.value;
        const newDataset = graphDataOptions[selectedKey];

        salesChart.data.labels = newDataset.labels;
        salesChart.data.datasets[0].data = newDataset.data;

        salesChart.update();
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
        window.location.href = 'Index.html';
    });
    }

});