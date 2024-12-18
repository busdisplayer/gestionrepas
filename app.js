// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(registration => {
      console.log('Service Worker enregistré avec succès :', registration);
    })
    .catch(error => {
      console.error('Échec de l\'enregistrement du Service Worker :', error);
    });
}

// Fonction pour demander la permission et afficher une notification
document.getElementById("studentForm").addEventListener("submit", function(event) {
  // Demander la permission d'afficher des notifications
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        sendNotification();
      } else {
        alert('Permission refusée pour les notifications.');
      }
    });
  } else if (Notification.permission === 'granted') {
    sendNotification();
  } else {
    alert('Les notifications sont bloquées.');
  }
});

// Fonction pour envoyer une notification
function sendNotification() {
  navigator.serviceWorker.ready.then(registration => {
    registration.showNotification('La mise à jour a été prise en compte !', {
      body: 'Les équipes de BusDisplayer vous remercie pour votre mise à jour ! 🌻',
      icon: 'https://tse2.mm.bing.net/th?id=OIP.FWIs5smFv0S9dRNl2-f98AHaHa&pid=Api', // URL de l'icône de la notification
      vibrate: [200, 100, 200], // Vibration pour les appareils mobiles
      tag: `bsdisplayer-repas-${new Date().toISOString().split('T')[0]}-intern`,
 // Identifiant unique pour éviter les doublons
    });
  });
}
