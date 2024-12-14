import fetch from 'node-fetch';

async function getCoordinates(location, city) {
    const query = `${location}, ${city}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
        return {
            latitude: data[0].lat,
            longitude: data[0].lon
        };
    } else {
        throw new Error("Location not found");
    }
}

// Example usage
getCoordinates("Eiffel Tower", "Paris")
    .then(coords => console.log(coords))
    .catch(err => console.error(err));
