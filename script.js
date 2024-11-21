let map; // Variabele voor de kaart

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("output").innerText = "Geolocatie wordt niet ondersteund door deze browser.";
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    document.getElementById("output").innerText = `Breedtegraad: ${lat}, Lengtegraad: ${lon}`;

    // Maak of update de kaart
    if (!map) {
        map = L.map('map').setView([lat, lon], 13); // Startkaart met locatie
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 13); // Verplaats bestaande kaart
    }

    // Voeg een marker toe
    L.marker([lat, lon]).addTo(map)
        .bindPopup('Je bent hier!')
        .openPopup();
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("output").innerText = "Toestemming geweigerd.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("output").innerText = "Locatiegegevens niet beschikbaar.";
            break;
        case error.TIMEOUT:
            document.getElementById("output").innerText = "De aanvraag duurde te lang.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("output").innerText = "Er is een onbekende fout opgetreden.";
            break;
    }
}
