// Function to handle smooth page transitions
function navigateToPage(url) {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
        window.location.href = url;
    }, 500); 
}

// Function to check if the user is on a mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Function for "Sign Up" button click
function handleSignUpClick() {
    if (isMobileDevice()) {
        window.location.href = 'mobile/sign-up.html';
    } else {
        window.location.href = 'sign-up.html';
    }
}

// Function for "Start Now" button click
function handleStartNowClick() {
    if (isMobileDevice()) {
        window.location.href = 'mobile/sign-up.html'; // Adjust this URL if needed
    } else {
        window.location.href = 'sign-up.html'; // Adjust this URL if needed
    }
}

// Function for "Login" button click
function handleLoginClick() {
    if (isMobileDevice()) {
        window.location.href = 'mobile/login.html';
    } else {
        window.location.href = 'login.html';
    }
}

// Add click event listeners to the buttons
document.getElementById('signup-btn').addEventListener('click', handleSignUpClick);
document.getElementById('start-now-btn').addEventListener('click', handleStartNowClick);
document.getElementById('login-btn').addEventListener('click', handleLoginClick);