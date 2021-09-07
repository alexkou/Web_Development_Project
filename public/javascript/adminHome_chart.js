var methodsChart = document.getElementById('methodsChart').getContext('2d');

let chart1 = new Chart(methodsChart, {
    type: 'bar',
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
                stepSize:1
            }
        }]
    }
})


var methodObject = JSON.parse(document.getElementById("methodObject").value)

for (method in methodObject) {
    chart1.data.labels.push(method)
    chart1.data.datasets[0].data.push(methodObject[method])
    random_colors(chart1);
} 



chart1.update();


function random_colors(chart) {
    var color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",";
    chart.data.datasets[0].backgroundColor.push(color + "0.6)");
    chart.data.datasets[0].borderColor.push(color + "1)");
}