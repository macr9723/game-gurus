// For using game images in modal
document.addEventListener('DOMContentLoaded', function() {
    const plusIcons = document.querySelectorAll('.plus-icon');
    const modalImage = document.getElementById('modalImage');
  
    plusIcons.forEach(icon => {
      icon.addEventListener('click', function() {
        const cardImage = icon.parentElement.querySelector('img');
              
        modalImage.src = cardImage.src;
        modalImage.alt = cardImage.alt;
      });
    });
  });
  
  function openModal(gameId, gameName) { 
    document.getElementById("gameId").value = gameId;
    document.getElementById("gameName").value = gameName;
  }