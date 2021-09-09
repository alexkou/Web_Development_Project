var methodsChart = document.getElementById('methodsChart').getContext('2d');

let chart1 = new Chart(methodsChart, {
    type: 'bar',
    data: {
        labels: [],

        datasets: [{
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            datalabels: {
                anchor: "end",
                align: "top",
                offset: 0
            }
        }]
    },

    plugins: [ChartDataLabels],

    options: {
        y: [{
            ticks: {
                beginAtZero: true,
                stepSize: 1
            }
        }],

        legend: {
            display: false
        },

        title: {
            display: true,
            text: "Methods",
            fontSize: 15,
            padding: 15
        }

    }
})


var methodObject = JSON.parse(document.getElementById("methodObject").value);

for (method in methodObject) {
    chart1.data.labels.push(method)
    chart1.data.datasets[0].data.push(methodObject[method])
    random_colors(chart1);
}

chart1.update();


var statusChart = document.getElementById('statusChart').getContext('2d');

let chart2 = new Chart(statusChart, {
    type: 'bar',
    data: {
        labels: [],

        datasets: [{
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            datalabels: {
                anchor: "end",
                align: "top",
                offset: 0
            }
        }]
    },

    plugins: [ChartDataLabels],


    options: {
        y: [{
            ticks: {
                beginAtZero: true,
                stepSize: 1
            }
        }],

        legend: {
            display: false
        },

        title: {
            display: true,
            text: "Status",
            fontSize: 15,
        }

    }
})


var statusObject = JSON.parse(document.getElementById("statusObject").value);

for (stat in statusObject) {
    chart2.data.labels.push(stat)
    chart2.data.datasets[0].data.push(statusObject[stat])
    random_colors(chart2);
}

chart2.update();


var ispChart = document.getElementById('ispChart').getContext('2d');

let chart3 = new Chart(ispChart, {
    type: 'bar',
    data: {
        labels: [],

        datasets: [{
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            datalabels: {
                anchor: "end",
                align: "top",
                offset: 0
            }
        }]
    },

    plugins: [ChartDataLabels],

    options: {
        y: [{
            ticks: {
                beginAtZero: true,
                stepSize: 1
            }
        }],

        legend: {
            display: false
        },

        title: {
            display: true,
            text: "ISP",
            fontSize: 15,
            padding: 15
        }
    }
})


var ispObject = JSON.parse(document.getElementById("ispObject").value);

for (isp in ispObject) {
    chart3.data.labels.push(isp)
    chart3.data.datasets[0].data.push(ispObject[isp])
    random_colors(chart3);
}

chart3.update();


var contentChart = document.getElementById('contentChart').getContext('2d');

let chart4 = new Chart(contentChart, {
    type: 'bar',
    data: {
        labels: [],

        datasets: [{
            label: 'Content Type',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    },

    options: {
        y: [{
            ticks: {
                beginAtZero: true,
                stepSize: 1
            }
        }]
    }
})


var contentTypeArray = JSON.parse(document.getElementById("contentTypeArray").value);

for (content in contentTypeArray) {
    chart4.data.labels.push(content)
    chart4.data.datasets[0].data.push(contentTypeArray[content].avg)
}

chart4.update();

// for (let i=0; i<contentTypeArray.length; i++) { 
//         contentTypeArray[i].type
//         contentTypeArray[i].avg

//  }

function random_colors(chart) {
    var color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",";
    chart.data.datasets[0].backgroundColor.push(color + "0.6)");
    chart.data.datasets[0].borderColor.push(color + "1)");
}

