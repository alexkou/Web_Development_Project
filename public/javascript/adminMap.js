const map = L.map('adminMap').setView([37.9838, 23.7275], 6);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 18,
id: 'mapbox/streets-v11',
tileSize: 512,
zoomOffset: -1,
accessToken: 'pk.eyJ1IjoiYWxleGtvdSIsImEiOiJja3NoYTl0NW8wZ2I2MnBtYnJ2czVxdXMzIn0.VzzD5IlXvy58UzeS9WHWVQ'
}).addTo(map);
