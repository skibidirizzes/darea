// Variabele voor de kaart
let map;

// Functie om toestemmingen aan te vragen
async function requestPermissions() {
    try {
        // Haal instellingen op uit localStorage
        const micCamEnabled = localStorage.getItem("micCamEnabled") === "true";
        const locationEnabled = localStorage.getItem("locationEnabled") === "true";
        const notificationsEnabled = localStorage.getItem("notificationsEnabled") === "true";

        const permissions = [];

        // Locatie toestemming
        if (locationEnabled) {
            permissions.push(new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    (error) => {
                        alert("Locatie toestemming geweigerd. Probeer opnieuw.");
                        reject(error);
                    },
                    { enableHighAccuracy: true }
                );
            }));
        }

        // Microfoon en camera toestemming
        if (micCamEnabled) {
            permissions.push(navigator.mediaDevices.getUserMedia({ audio: true, video: true }));
        }

        // Notificaties toestemming
        if (notificationsEnabled && "Notification" in window) {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                alert("Notificatie toestemming geweigerd.");
                throw new Error("Notificatie geweigerd");
            }
        }

        // Wacht op alle toestemmingen
        await Promise.all(permissions);

        alert("Alle toestemmingen zijn succesvol verleend!");
    } catch (error) {
        console.error("Fout tijdens toestemmingsverzoeken:", error);
    }
}

// Locatie ophalen en tonen op kaart
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    } else {
        document.getElementById("output").innerText =
            "Geolocatie wordt niet ondersteund door deze browser.";
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    document.getElementById("output").innerText = `Breedtegraad: ${lat}, Lengtegraad: ${lon}`;

    // Maak of update de kaart
    if (!map) {
        map = L.map("map").setView([lat, lon], 13); // Startkaart met locatie
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }).addTo(map);
    } else {
        map.setView([lat, lon], 13); // Verplaats bestaande kaart
    }

    // Voeg een marker toe
    L.marker([lat, lon])
        .addTo(map)
        .bindPopup("Je bent hier!")
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

// Event listener voor de toestemmingen knop
document.getElementById("permissionButton").addEventListener("click", async () => {
    await requestPermissions();
    getLocation();
});

// Functie om gegevens op te slaan
function saveData() {
    const data = {
        location: document.getElementById("output").innerText,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem("userData", JSON.stringify(data));
}

// Opslag triggeren bij verlaten pagina
window.addEventListener("beforeunload", saveData);
