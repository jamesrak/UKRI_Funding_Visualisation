
function scrollToNext(id) {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: "smooth" });
}

const labels1 = [
    'University College London',
    'The University of Oxford',
    'The University of Cambridge',
    'The University of Manchester',
    'The University of Edinburgh',
    'Imperial College of Science, Technology and Medicine',
    'The University of Leeds',
    'The University of Bristol',
    'The University of Sheffield',
    'The University of Birmingham'
];
const labels2 = [
    'University College London',
    'The University of Oxford',
    'Imperial College of Science, Technology and Medicine',
    'The University of Cambridge',
    'The University of Manchester',
    'The University of Edinburgh',
    'The University of Leeds',
    'The University of Glasgow',
    'The University of Bristol',
    'The University of Sheffield'
];

const data1 = {
    labels: labels1,
    datasets: [{
        label: 'Projects Count',
        data: [876, 800, 669, 645, 637, 627, 533, 506, 444, 437],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }]
};

const data2 = {
    labels: labels2,
    datasets: [{
        label: 'Amount Value',
        data: [619404, 581556, 469413, 442006, 395279, 387985, 308140, 282475, 271796, 249582],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
    }]
};

const config1 = {
    type: 'bar',
    data: data1,
    options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Funded Projects by Research Institutes',
                font: {
                    size: 22,
                    weight: 'bold'
                }
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context) => `Projects Count: ${data1.datasets[context.datasetIndex].data[context.dataIndex]}`
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    stepSize: 100
                }
            }
        }
    }
};

const config2 = {
    type: 'bar',
    data: data2,
    options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Funded Amount by Research Institutes',
                font: {
                    size: 22,
                    weight: 'bold'
                }
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context) => `Amount Value: £${data2.datasets[context.datasetIndex].data[context.dataIndex]}`
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    stepSize: 100000
                }
            }
        }
    }
};


const data3 = {
    labels: [
        'Disruptive Technology',
        'Manufacturing, Materials & Mobility',
        'Ageing Society, Health & Nutrition',
        'Clean Growth & Infrastructure',
        'AI & Data Economy',
        'Others'
    ],
    datasets: [{
        data: [39.1, 25.2, 11.9, 11.7, 6.5, 5.6],
        backgroundColor: [
            'rgb(255, 255, 92)',
            'rgb(255, 20, 103)',
            'rgb(24, 204, 0)',
            'rgb(255, 98, 36)',
            'rgb(0, 132, 240)',
            'rgb(98, 40, 40)'
        ],
        hoverOffset: 4
    }]
};

const config3 = {
    type: 'pie',
    data: data3,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Funded Projects by Sectors',
                font: {
                    size: 22,
                    weight: 'bold'
                }
            },
            legend: {
                position: 'left',
                labels: {
                    boxWidth: 20,
                    boxHeight: 20,
                },
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context) => `${context.label}: ${context.raw}%`
                }
            },
            datalabels: {
                color: '#000',
                formatter: (value, context) => {
                    return `${value}%`;
                }
            },
            aspectRatio: 1
        }
    }
};

// Pie Chart 2
const data4 = {
    labels: [
        'Disruptive Technology',
        'Manufacturing, Materials & Mobility',
        'Ageing Society, Health & Nutrition',
        'Clean Growth & Infrastructure',
        'AI & Data Economy',
        'Others'
    ],
    datasets: [{
        data: [13.1, 44.4, 16, 14.2, 5.4, 6.9],
        backgroundColor: [
            'rgb(255, 255, 92)',
            'rgb(255, 20, 103)',
            'rgb(24, 204, 0)',
            'rgb(255, 98, 36)',
            'rgb(0, 132, 240)',
            'rgb(98, 40, 40)'
        ],
        hoverOffset: 4
    }]
};

const config4 = {
    type: 'pie',
    data: data4,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Funded Amount by Sectors',
                font: {
                    size: 22,
                    weight: 'bold'
                }
            },
            legend: {
                position: 'left',
                labels: {
                    boxWidth: 20,
                    boxHeight: 20,
                },

            },

            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context) => `${context.label}: ${context.raw}%`
                }
            },
            datalabels: {
                color: '#000',
                formatter: (value, context) => {
                    return `${value}%`;
                }
            },
            aspectRatio: 1
        }
    }
};

window.onload = function () {
    // Bar charts
    const ctx1 = document.getElementById('barChart1').getContext('2d');
    new Chart(ctx1, config1);

    const ctx2 = document.getElementById('barChart2').getContext('2d');
    new Chart(ctx2, config2);

    const pieCtx1 = document.getElementById('pieChart1').getContext('2d');
    new Chart(pieCtx1, config3);

    const pieCtx2 = document.getElementById('pieChart2').getContext('2d');
    new Chart(pieCtx2, config4);
}
