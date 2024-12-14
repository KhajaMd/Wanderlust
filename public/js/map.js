mapboxgl.accessToken = mapToken;
console.log(mapboxgl.accessToken);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style:"mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});




const marker = new mapboxgl.Marker({color: 'red'})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.title} <p> bookup now at this exact location</p>`))
.addTo(map);
