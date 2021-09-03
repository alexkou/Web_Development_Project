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
} 

chart1.update();

console.log(methodObject)