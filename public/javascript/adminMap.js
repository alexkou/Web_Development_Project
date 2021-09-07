const map = L.map('adminMap').setView([37.9838, 23.7275], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 18,
id: 'mapbox/streets-v11',
tileSize: 512,
zoomOffset: -1,
accessToken: 'pk.eyJ1IjoiYWxleGtvdSIsImEiOiJja3NoYTl0NW8wZ2I2MnBtYnJ2czVxdXMzIn0.VzzD5IlXvy58UzeS9WHWVQ'
}).addTo(map);


function LoadObjects() {
    usersLatLong = JSON.parse(document.getElementById('usersLatLong').value);
    requestIps = JSON.parse(document.getElementById('requestIps').value);
}

var users = document.getElementById('usersSelection');

let usersLatLong, requestIps, markerGroup, polylineGroup;

users.addEventListener('change', (event) => {

    LoadObjects();
    
    var choice = event.target.value;

    let userObject = usersLatLong.filter(x => x.id === choice)
    console.log(userObject)
    delete userObject[0]["id"]

    let userMarker = Object.values(userObject[0])

    let array = [];


    for (let i=0; i<requestIps.length; i++) {
        if (requestIps[i][0]["user"] === choice) {
            delete requestIps[i]["user"]
            array = requestIps[i];
        }

    }

    let markerWeight = [];
    let markerLatLon = [];
    let markers = [];

    for (entry of array) {
        let weight = entry.intensity * 10;
        markerWeight.push(weight);
        
        delete entry['user'];
        delete entry['intensity'];
        markerLatLon.push(Object.values(entry));

        let temp = [];
        temp.push(userMarker, Object.values(entry))
        markers.push(temp);
    }


    markerGroup = L.layerGroup().addTo(map)
    L.marker(userMarker).addTo(markerGroup)

    for (let marker of markerLatLon) {
        L.marker(marker).addTo(markerGroup)
    }

    var color = "rgb("+Math.floor(Math.random() * 255)+" , "+ Math.floor(Math.random() * 255)+" , "+ Math.floor(Math.random() * 255)+" )";

    polylineGroup = L.layerGroup().addTo(map)

    for (let i=0; i<markers.length; i++) {
        L.polyline(markers[i], {
            noClip: true,
            color: color, 
            weight: markerWeight[i]
        }).addTo(polylineGroup)
    }

});


document.getElementById("clear").addEventListener("click", () => {
    markerGroup.clearLayers();
    polylineGroup.clearLayers();
})
