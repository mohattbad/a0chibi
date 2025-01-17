document.addEventListener('DOMContentLoaded', () => {
  // Get the back button
  const backButton = document.getElementById('back-button');

  // Add click event listener
  backButton.addEventListener('click', () => {
    // Add a fade-out class to the button
    backButton.classList.add('fade-out');

    // Redirect to the home page after the transition
    setTimeout(() => {
      window.location.href = 'index.html'; // Replace with your home page URL
    }, 700); // Delay in milliseconds (matches the transition duration)
  });
});

// Disable right-click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Disable touch-and-hold
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault(); // Disable multi-touch
    }
});

document.addEventListener('touchend', (e) => {
    e.preventDefault(); // Disable long-press
});

document.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Disable touch movement (optional)
});