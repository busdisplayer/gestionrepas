// Remplacez par votre API_KEY
const API_KEY = '4af2273f7594c626db7eb4032177c1b97062854f'; // Remplace avec ta clé API
// ID de la feuille de calcul
const SHEET_ID = '1WQbPJuu9JS2eHes-1Z5Na_dzXMA3H-dmikUtvirHnN4';
// Plage à lire et écrire
const RANGE = 'Sheet1!A2:B'; // A partir de la ligne 2 pour ignorer les titres

function initClient() {
    gapi.client.init({
        'apiKey': API_KEY,
    }).then(() => {
        loadClassmates(); // Charger les camarades au démarrage
    });
}

function loadGAPI() {
    gapi.load('client', initClient);
}

// Événement pour le bouton d'envoi
document.getElementById('submit-time').addEventListener('click', () => {
    const mealTime = document.getElementById('meal-time').value;
    const studentName = document.getElementById('student-name').value;

    if (mealTime && studentName) {
        appendRow([mealTime, studentName]);
    }
});

// Fonction pour ajouter une ligne à Google Sheets
async function appendRow(values) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=RAW&key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            values: [values] // Valeurs à ajouter
        })
    });

    const data = await response.json();
    console.log(data);
    loadClassmates(); // Mettre à jour la liste des camarades
}

// Fonction pour charger la liste des camarades
async function loadClassmates() {
    const classmatesList = document.getElementById('students-list');
    classmatesList.innerHTML = ''; // Réinitialiser la liste

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    const data = await response.json();

    if (data.values) {
        data.values.forEach(row => {
            const listItem = document.createElement('li');
            listItem.textContent = `Étudiant : ${row[1]} mange à ${row[0]}`; // Utiliser les valeurs de la feuille
            classmatesList.appendChild(listItem);
        });
        document.getElementById('classmates-list').style.display = 'block';
    } else {
        console.log('No data found.');
    }
}

