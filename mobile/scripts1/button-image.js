document.addEventListener('DOMContentLoaded', () => {
  // Get the back button
  const backButton = document.getElementById('back-button');

  // Add click event listener
  backButton.addEventListener('click', () => {
    // Add a fade-out class to the button
    backButton.classList.add('fade-out');

    // Redirect to the home page after the transition
    setTimeout(() => {
      window.location.href = '../../index.html'; // Replace with your home page URL
    }, 700); // Delay in milliseconds (matches the transition duration)
  });
});
document.addEventListener('DOMContentLoaded', () => {
  // Get the back button
  const backButton = document.getElementById('back-button');

  // Add click event listener
  backButton.addEventListener('click', () => {
    // Add a fade-out class to the button
    backButton.classList.add('fade-out');

    // Redirect to the home page after the transition
    setTimeout(() => {
      window.location.href = '../../index.html'; // Replace with your home page URL
    }, 700); // Delay in milliseconds (matches the transition duration)
  });
});
///////
const modeToggle = document.getElementById('modeToggle');
const body = document.body;

modeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  // Save the user's preference in localStorage
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// Check for saved user preference, if any, on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
} else {
  body.classList.remove('dark-mode');
}