const SPREADSHEET_ID = '1WQbPJuu9JS2eHes-1Z5Na_dzXMA3H-dmikUtvirHnN4'; // Remplace par ton ID de feuille
const API_KEY = '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'; // Remplace par ta clé API
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

// Fonction pour charger la bibliothèque Google API
function initClient() {
    gapi.load('client', () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(() => {
            fetchStudents(); // Récupérer la liste des étudiants
        });
    });
}

// Récupérer les étudiants depuis Google Sheets
async function fetchStudents() {
    const range = 'Heures!B2:B1000'; // Plage des noms des étudiants
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const students = data.values.flat(); // Récupérer uniquement les noms

        const studentSelect = document.getElementById('studentSelect');
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student;
            option.textContent = student;
            studentSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des étudiants:", error);
    }
}

// Mettre à jour la feuille de calcul avec la nouvelle heure pour l'étudiant sélectionné
async function updateSheet(hour, student) {
    const range = `Heures!A2:B1000`; // Plage où les données sont mises à jour
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    const requestBody = {
        values: [[hour, student]],
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            document.getElementById('message').textContent = "Mise à jour réussie!";
        } else {
            const errorData = await response.json();
            document.getElementById('message').textContent = "Erreur lors de la mise à jour: " + errorData.error.message;
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi des données:", error);
        document.getElementById('message').textContent = "Erreur: " + error.message;
    }
}

// Ajouter l'événement au bouton
document.getElementById('updateButton').addEventListener('click', () => {
    const hour = document.getElementById('hourSelect').value;
    const student = document.getElementById('studentSelect').value;

    if (hour && student) {
        updateSheet(hour, student);
    } else {
        document.getElementById('message').textContent = "Veuillez sélectionner une heure et un étudiant.";
    }
});

// Initialiser la bibliothèque Google API
initClient();
