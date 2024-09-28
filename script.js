const API_KEY = 'AIzaSyAnXeNFcsaDIEW4tVTValvOiW5KySE8F9Q';
const SPREADSHEET_ID = '1WQbPJuu9JS2eHes-1Z5Na_dzXMA3H-dmikUtvirHnN4';
const RANGE = 'Heures!A2:B1000'; // Plage contenant les heures et étudiants

async function fetchStudents() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.values) {
            populateStudentSelect(data.values);
        } else {
            console.error('Aucune donnée trouvée dans la plage spécifiée.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

function populateStudentSelect(values) {
    const studentSelect = document.getElementById('studentSelect');
    studentSelect.innerHTML = ''; // Réinitialise les options

    values.forEach(row => {
        const option = document.createElement('option');
        option.value = row[1]; // Colonne B (Étudiant)
        option.textContent = row[1]; // Texte affiché dans la liste
        studentSelect.appendChild(option);
    });
}

async function updateSheet(hour, student) {
    // Trouve la bonne ligne pour l'étudiant sélectionné
    const values = await fetchStudentsAndGetValues(); // Récupère les valeurs pour trouver l'étudiant
    const rowIndex = values.findIndex(row => row[1] === student) + 2; // +2 pour ajuster à l'index de la feuille (A2)

    if (rowIndex >= 2) { // Assurez-vous que l'étudiant est trouvé
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Heures!A${rowIndex}:B${rowIndex}?valueInputOption=USER_ENTERED&key=${API_KEY}`;
        const requestBody = {
            values: [[hour, student]] // Met à jour l'heure pour cet étudiant
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
                const result = await response.json();
                document.getElementById('message').textContent = 'Mise à jour réussie!';
                console.log(result);
            } else {
                const error = await response.json();
                document.getElementById('message').textContent = 'Erreur lors de la mise à jour: ' + (error.message || error);
                console.error('Erreur:', error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
        }
    } else {
        document.getElementById('message').textContent = 'Étudiant non trouvé!';
    }
}

async function fetchStudentsAndGetValues() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values || [];
}

// Événements
document.getElementById('submitButton').addEventListener('click', () => {
    const selectedHour = document.getElementById('timeSelect').value;
    const selectedStudent = document.getElementById('studentSelect').value;
    updateSheet(selectedHour, selectedStudent);
});

// Initialisation
fetchStudents();
