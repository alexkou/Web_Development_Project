var methodsChart = document.getElementById('methodsChart').getContext('2d');

let chart1 = new Chart(methodsChart, {
    type: 'pie',
    data: {
        labels: [],

        datasets: [{
            label: 'Method',
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


var methodObject = JSON.parse(document.getElementById("methodObject").value);

for (method in methodObject) {
    chart1.data.labels.push(method)
    chart1.data.datasets[0].data.push(methodObject[method])
    random_colors1();
}


chart1.update();


console.log(methodObject)



var statusChart = document.getElementById('statusChart').getContext('2d');

let chart2 = new Chart(statusChart, {
    type: 'pie',
    data: {
        labels: [],

        datasets: [{
            label: 'Status',
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


var statusObject = JSON.parse(document.getElementById("statusObject").value);

for (stat in statusObject) {
    chart2.data.labels.push(stat)
    chart2.data.datasets[0].data.push(statusObject[stat])
    random_colors2();
}

chart2.update();


var ispChart = document.getElementById('ispChart').getContext('2d');

let chart3 = new Chart(ispChart, {
    type: 'pie',
    data: {
        labels: [],

        datasets: [{
            label: 'ISP',
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


var ispObject = JSON.parse(document.getElementById("ispObject").value);

for (isp in ispObject) {
    chart3.data.labels.push(isp)
    chart3.data.datasets[0].data.push(ispObject[isp])
    random_colors3();
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

function random_colors1() {
    var color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",";
    chart1.data.datasets[0].backgroundColor.push(color + "0.6)");
    chart1.data.datasets[0].borderColor.push(color + "1)");
}

function random_colors2() {
    var color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",";
    chart2.data.datasets[0].backgroundColor.push(color + "0.6)");
    chart2.data.datasets[0].borderColor.push(color + "1)");
}

function random_colors3() {
    var color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",";
    chart3.data.datasets[0].backgroundColor.push(color + "0.6)");
    chart3.data.datasets[0].borderColor.push(color + "1)");
}