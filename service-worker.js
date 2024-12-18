self.addEventListener('notificationclick', event => {
  console.log('Notification cliquée:', event.notification);
  event.notification.close(); // Fermer la notification

  // Ouvrir une page spécifique lorsque l'utilisateur clique sur la notification
  event.waitUntil(
    clients.openWindow('https://busdisplayer.github.io/gestionrepas/') // Remplacez par l'URL souhaitée
  );
});
