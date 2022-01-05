// const whanau = require("../../models/whanau");
// Not sure where above came from!!

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: whanau.geometry.coordinates, // starting position [lng, lat]
zoom: 10 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker()
    .setLngLat(whanau.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${whanau.name}</h3><p>${whanau.location}</p>`
        )
    )
    .addTo(map)