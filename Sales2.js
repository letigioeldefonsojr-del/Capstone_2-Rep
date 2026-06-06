const chartElement = document.getElementById('salesBarChart').getContext('2d');
const dropdownMenu = document.getElementById('timeframeSelector');

const startYear = 2027;
const totalBlocksOfFiveYears = 4; 

const graphDataOptions = {};
let dropdownHTMLContent = '';


for (let b = 0; b < totalBlocksOfFiveYears; b++) {
    const blockStart = startYear + (b * 5);
    const blockEnd = blockStart + 4;
    const blockKey = `${blockStart}-${blockEnd}`;
    const blockLabel = `Years: ${blockStart} - ${blockEnd}`;

    const labelsArray = [];
    const dataArray = [];

  
    for (let year = blockStart; year <= blockEnd; year++) {
        labelsArray.push(year.toString());
        dataArray.push(Math.floor(Math.random() * 45) + 10);
    }

    graphDataOptions[blockKey] = {
        labels: labelsArray,
        data: dataArray
    };

    
    dropdownHTMLContent += `<option value="${blockKey}">${blockLabel}</option>`;
}


dropdownMenu.innerHTML = dropdownHTMLContent;


const defaultBlockKey = `${startYear}-${startYear + 4}`;
const defaultDataset = graphDataOptions[defaultBlockKey];


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
    const selectedBlock = event.target.value;
    const newDataset = graphDataOptions[selectedBlock];

    salesChart.data.labels = newDataset.labels;
    salesChart.data.datasets[0].data = newDataset.data;

    salesChart.update();
});