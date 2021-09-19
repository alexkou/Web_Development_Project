const map = L.map('myMap').setView([37.9838, 23.7275], 6);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
minZoom: 2,
maxZoom: 18,
id: 'mapbox/streets-v11',
tileSize: 512,
zoomOffset: -1,
accessToken: 'pk.eyJ1IjoiYWxleGtvdSIsImEiOiJja3NoYTl0NW8wZ2I2MnBtYnJ2czVxdXMzIn0.VzzD5IlXvy58UzeS9WHWVQ'
}).addTo(map);


const heatData = (document.getElementById('heatMapData')).value;

if (heatData != "") {

    const heatMapData = JSON.parse(heatData);
    
    heatArray = [];

    for (let i=0; i< heatMapData.length; i++) {
        heatArray.push(Object.values(heatMapData[i]));
    }



    var heat = L.heatLayer(heatArray, 
    {radius: 25, 
    minOpacity: 0.4, 
    gradient: 	{'0': 'Navy', '0.25': 'Blue', '0.5': 'Green', '0.75': 'Yellow', '1': 'Red'}
    }).addTo(map);
}