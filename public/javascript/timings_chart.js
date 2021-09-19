var myChart = document.getElementById('timings_chart').getContext('2d');

var chart = new Chart(myChart, {
    
    type: 'bar',
    data: {
        labels: ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
        "15:00", "16:00", "17:00", "18:00", "19:00", "20:00","21:00","22:00","23:00"],

        datasets: [{
            label: '',
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
});


var contentType = JSON.parse(document.getElementById("contentTypeData").value);

document.getElementById("contentTypeSelection").onchange =  function () {
    chart.data.datasets[0].label = "Content Type"
    chart.data.datasets[0].data = [];

    var choices = $(this).val();

    if (choices.length === 1) {
        for (content of contentType) {
            if(content.data == choices[0]) {
                for (let i=0; i<=23; i++)  {
                    if (content.avgTiming.hasOwnProperty(i)) {
                        chart.data.datasets[0].data.push(content.avgTiming[`${i}`].avg);
                    }
                    else {
                        chart.data.datasets[0].data.push(0)
                    }
                    random_colors();

                }
            }
        }
        chart.update();

    } else if (choices.length > 1) {

        let avgObj = {};

        for (choice of choices) {
            for (content of contentType) {
                if (content.data == choice) {
                    let temp = content.avgTiming
                    for (key in temp) {
                        if(!(key in avgObj)) {
                            avgObj[`${key}`] = temp[key]
                        } else if(key in avgObj) {
                            avgObj[key].avg = ((avgObj[key].avg * avgObj[key].count) + (temp[key].avg * temp[key].count)) / (avgObj[key].count + temp[key].count);
                            avgObj[key].count = avgObj[key].count + temp[key].count;
                        }
                    }
                }
            }
        }

        for (let i=0; i<=23; i++)  {
            if (avgObj.hasOwnProperty(i)) {
                chart.data.datasets[0].data.push(avgObj[`${i}`].avg);
            }
            else {
                chart.data.datasets[0].data.push(0)
            }
            random_colors();

        }
        chart.update();
    }
};



var methods = JSON.parse(document.getElementById('method').value);

document.getElementById('httpMethod').onchange = function() {
    chart.data.datasets[0].label = "HTTP Methods"
    chart.data.datasets[0].data = [];

    var choices = $(this).val();

    if (choices.length === 1) {
        for (content of methods) {
            if(content.data == choices[0]) {
                for (let i=0; i<=23; i++)  {
                    if (content.avgTiming.hasOwnProperty(i)) {
                        chart.data.datasets[0].data.push(content.avgTiming[`${i}`].avg);
                    }
                    else {
                        chart.data.datasets[0].data.push(0)
                    }
                    random_colors();

                }
            }
        }
        chart.update();

    } else if (choices.length > 1) {

        let avgObj = {};

        for (choice of choices) {
            for (content of methods) {
                if (content.data == choice) {
                    let temp = content.avgTiming
                    for (key in temp) {
                        if(!(key in avgObj)) {
                            avgObj[`${key}`] = temp[key]
                        } else if(key in avgObj) {
                            avgObj[key].avg = ((avgObj[key].avg * avgObj[key].count) + (temp[key].avg * temp[key].count)) / (avgObj[key].count + temp[key].count);
                            avgObj[key].count = avgObj[key].count + temp[key].count;
                        }
                    }
                }
            }
        }

        for (let i=0; i<=23; i++)  {
            if (avgObj.hasOwnProperty(i)) {
                chart.data.datasets[0].data.push(avgObj[`${i}`].avg);
            }
            else {
                chart.data.datasets[0].data.push(0)
            }
            random_colors();

        }
        chart.update();
    }
};



var isps = JSON.parse(document.getElementById('isp').value);

document.getElementById('ispSelection').onchange = function() {
    chart.data.datasets[0].label = "ISP"
    chart.data.datasets[0].data = [];

    var choices = $(this).val();

    if (choices.length === 1) {
        for (content of isps) {
            if(content.data == choices[0]) {
                for (let i=0; i<=23; i++)  {
                    if (content.avgTiming.hasOwnProperty(i)) {
                        chart.data.datasets[0].data.push(content.avgTiming[`${i}`].avg);
                    }
                    else {
                        chart.data.datasets[0].data.push(0)
                    }
                    random_colors();

                }
            }
        }
        chart.update();

    } else if (choices.length > 1) {

        let avgObj = {};

        for (choice of choices) {
            for (content of isps) {
                if (content.data == choice) {
                    let temp = content.avgTiming
                    for (key in temp) {
                        if(!(key in avgObj)) {
                            avgObj[`${key}`] = temp[key]
                        } else if(key in avgObj) {
                            avgObj[key].avg = ((avgObj[key].avg * avgObj[key].count) + (temp[key].avg * temp[key].count)) / (avgObj[key].count + temp[key].count);
                            avgObj[key].count = avgObj[key].count + temp[key].count;
                        }
                    }
                }
            }
        }

        for (let i=0; i<=23; i++)  {
            if (avgObj.hasOwnProperty(i)) {
                chart.data.datasets[0].data.push(avgObj[`${i}`].avg);
            }
            else {
                chart.data.datasets[0].data.push(0)
            }
            random_colors();

        }
        chart.update();
    }
};

var days = JSON.parse(document.getElementById('day').value);


days = days[0];

temp = days;
temp = Object.keys(temp).map(i => temp[i]);

const unique = [...new Set(temp.map(item => item.day))];
const daysObject = []

for (let i = 0; i < unique.length; i++) {
    daysObject.push({
        day: unique[i],
        avg: {}
    })
}

for (entry in days) {
    for (u of daysObject) {
        if (days[entry].day == u.day) {
            let temp = {[days[entry].hour]: parseFloat(entry)}
            u.avg[[days[entry].hour]] = parseFloat(entry)
        }
    }
}


document.getElementById('daySelection').onchange = function() {
    chart.data.datasets[0].label = "Timings"
    chart.data.datasets[0].data = [];

    var choices = $(this).val();

    if (choices.length === 1) {
        for (content of daysObject) {
            if(content.day == choices[0]) {
                for (let i=0; i<=23; i++)  {
                    if (content.avg.hasOwnProperty(i)) {
                        chart.data.datasets[0].data.push(content.avg[`${i}`]);
                    }
                    else {
                        chart.data.datasets[0].data.push(0)
                    }
                    random_colors();
                }
            }
        }
        chart.update();

    } else if (choices.length > 1) {

        let avgObj = {};

        for (choice of choices) {
            for (content of daysObject) {
                if (content.day == choice) {
                    let temp = content.avg
                    for (key in temp) {
                        if(!(key in avgObj)) {
                            avgObj[`${key}`] = temp[key]
                        } else if(key in avgObj) {
                            avgObj[key].avg = ((avgObj[key].avg * avgObj[key].count) + (temp[key].avg * temp[key].count)) / (avgObj[key].count + temp[key].count);
                            avgObj[key].count = avgObj[key].count + temp[key].count;
                        }
                    }
                }
            }
        }

        for (let i=0; i<=23; i++)  {
            if (avgObj.hasOwnProperty(i)) {
                chart.data.datasets[0].data.push(avgObj[`${i}`]);
            }
            else {
                chart.data.datasets[0].data.push(0)
            }
            random_colors();
        }
        chart.update();
    }
};

function random_colors() {
    var color = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",";
    chart.data.datasets[0].backgroundColor.push(color + "0.6)");
    chart.data.datasets[0].borderColor.push(color + "1)");
}