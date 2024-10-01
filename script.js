const url = "https://sheets.googleapis.com/v4/spreadsheets/1WQbPJuu9JS2eHes-1Z5Na_dzXMA3H-dmikUtvirHnN4/values/Heures!A2:B?key=AIzaSyAnXeNFcsaDIEW4tVTValvOiW5KySE8F9Q";
const tableBody = document.querySelector("#studentTable tbody);

fetch(url)
.then(response => response.json())
.then(data => {
    const values = data.values;
    values.forEach(row => {
        const tr = document.createElement('tr');
        const tdHeure = document.createElement('td');
        tdHeure.textContent = row[0];
        tr.appendChild(tdHeure);
        const tdNom = document.createElement('td');
        tdNom.textContent = row[1];
        tr.appendChild(tdNom);
        tableBody.appendChild(tr);
    });
})
.catch(error => console.error("Erreur de chargement:", error));
    

    
