// script.js

// Variabele voor de kaart
let map;

// Functie om toestemmingen aan te vragen
async function requestPermissions() {
    try {
        const micCamEnabled = localStorage.getItem("micCamEnabled") === "true";
        const locationEnabled = localStorage.getItem("locationEnabled") === "true";
        const recordingDuration = parseInt(localStorage.getItem("recordingDuration"), 10) || 5;

        const permissions = [];

        if (locationEnabled) {
            permissions.push(new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    (error) => {
                         console.error("Locatie toestemming geweigerd:", error);
                         document.getElementById("output").innerText = "Locatie toestemming geweigerd.";
                         reject(error);
                    },
                    { enableHighAccuracy: true }
                );
            }));
        }

        if (micCamEnabled) {
             permissions.push(requestMicCamPermission(recordingDuration));
        }


        await Promise.all(permissions);

        document.getElementById("output").innerText = "Alle toestemmingen zijn succesvol verleend!";
    } catch (error) {
        console.error("Fout tijdens toestemmingsverzoeken:", error);
         document.getElementById("output").innerText = "Fout tijdens toestemmingsverzoeken, check de console.";
    }
}

async function requestMicCamPermission(recordingDuration) {
        return new Promise(async (resolve, reject) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                const options = { mimeType: 'video/webm; codecs=vp9' };
                const mediaRecorder = new MediaRecorder(stream, options);
                let chunks = [];

                mediaRecorder.ondataavailable = function (e) {
                    if (e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };

                mediaRecorder.onstop = function () {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const reader = new FileReader();

                    reader.onloadend = function () {
                        const base64data = reader.result;
                         console.log("Opname voltooid:", base64data);
                        resolve();
                    };
                    reader.readAsDataURL(blob);
                };

                mediaRecorder.start();

                setTimeout(() => {
                    mediaRecorder.stop();
                    stream.getTracks().forEach(track => track.stop());
                }, recordingDuration * 1000);
            } catch (error) {
                 console.error("Kon de microfoon en camera niet openen:", error);
                document.getElementById("output").innerText = "Kon de microfoon en camera niet openen. Zorg ervoor dat je toestemming hebt gegeven.";
                reject(error);
            }
        });
}


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

    if (!map) {
        map = L.map("map").setView([lat, lon], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }).addTo(map);
    } else {
        map.setView([lat, lon], 13);
    }

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

document.getElementById("permissionButton").addEventListener("click", async () => {
    await requestPermissions();
    getLocation();
});

function saveData() {
    const data = {
        location: document.getElementById("output").innerText,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem("userData", JSON.stringify(data));
}

window.addEventListener("beforeunload", saveData);
function saveData() {
    const data = {
        location: document.getElementById("output").innerText,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem("userData", JSON.stringify(data));
}

window.addEventListener("beforeunload", saveData);
