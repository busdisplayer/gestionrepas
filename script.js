const SPREADSHEET_ID = '1WQbPJuu9JS2eHes-1Z5Na_dzXMA3H-dmikUtvirHnN4';
const API_KEY = 'AIzaSyAnXeNFcsaDIEW4tVTValvOiW5KySE8F9Q'; // Remplace par ta vraie clé API

async function fetchStudents() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Heures!B2:B1000?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const error = await response.json();
            console.error('Erreur lors de la récupération des étudiants:', error);
            return [];
        }
        const data = await response.json();
        return data.values.map(row => row[0]); // Récupère uniquement les noms d'étudiants
    } catch (error) {
        console.error('Erreur réseau:', error);
        return [];
    }
}

async function updateSheet(hour, student) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Heures!A2:B1000?key=${API_KEY}`;
    const requestBody = {
        values: [[hour, student]] // Les données à mettre à jour
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
            console.log('Résultat:', result);
        } else {
            const error = await response.json();
            document.getElementById('message').textContent = 'Erreur lors de la mise à jour: ' + JSON.stringify(error);
            console.error('Erreur:', error);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données:', error);
        document.getElementById('message').textContent = 'Erreur: ' + JSON.stringify(error);
    }
}

document.getElementById('updateButton').addEventListener('click', () => {
    const hour = document.getElementById('hourSelect').value;
    const student = document.getElementById('studentSelect').value;
    if (hour && student) {
        updateSheet(hour, student);
    } else {
        document.getElementById('message').textContent = 'Veuillez sélectionner une heure et un étudiant.';
    }
});

// Charger les étudiants dans la liste déroulante
fetchStudents().then(students => {
    const studentSelect = document.getElementById('studentSelect');
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student;
        option.textContent = student;
        studentSelect.appendChild(option);
    });
});
