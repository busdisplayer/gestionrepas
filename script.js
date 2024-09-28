// Remplacez par votre propre clé API et l'ID de la feuille de calcul
const API_KEY = 'AIzaSyAnXeNFcsaDIEW4tVTValvOiW5KySE8F9Q'; // Votre clé API ici
const SPREADSHEET_ID = '1WQbPJuu9JS2eHes-1Z5Na_dzXMA3H-dmikUtvirHnN4'; // Votre ID de feuille de calcul ici
const RANGE = 'Heures!A2:B1000'; // Plage à lire

async function fetchData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        processResponse(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

function processResponse(data) {
    const tableBody = document.getElementById("studentsTable").getElementsByTagName("tbody")[0];

    // Vider le corps du tableau avant d'ajouter des nouvelles données
    tableBody.innerHTML = '';

    if (data.values && data.values.length > 0) {
        data.values.forEach(row => {
            const hour = row[0];
            const student = row[1];

            // Créer une nouvelle ligne dans le tableau
            const newRow = tableBody.insertRow();
            const hourCell = newRow.insertCell(0);
            const studentCell = newRow.insertCell(1);

            hourCell.textContent = hour;
            studentCell.textContent = student;
        });
    } else {
        const newRow = tableBody.insertRow();
        const cell = newRow.insertCell(0);
        cell.colSpan = 2;
        cell.textContent = "Aucune donnée trouvée.";
    }
}

// Appel de la fonction pour récupérer les données lors du chargement de la page
fetchData();
