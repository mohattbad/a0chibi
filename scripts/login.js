document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://chibiv2.fly.dev/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // Save the token to localStorage
            localStorage.setItem('token', result.token);

            // Login successful
            showPopupMessage(`Welcome back, ${email}!`, "success");

            // Hide the login page and show the loading page
            document.getElementById("loginPage").style.display = "none";
            document.getElementById("loadingPage").style.display = "block";

            // Play the background video and welcome sound ONLY on successful login
            const loadingVideo = document.getElementById("loading-video");
            const welcomeSound = document.getElementById("welcome-sound");

            if (loadingVideo) {
                loadingVideo.play(); // Play the background video
            }

            if (welcomeSound) {
                welcomeSound.play(); // Play the welcome sound
            }

            // Fade out the video before redirecting
            setTimeout(() => {
                if (loadingVideo) {
                    loadingVideo.classList.add("fade-out"); // Add fade-out class
                }

                // Redirect to dashboard.html after the fade-out completes (1.5 seconds)
                setTimeout(() => {
                    window.location.href = "/dashboard.html";
                }, 1000); // Match this duration with the CSS transition duration
            }, 2000); // Wait 4.5 seconds before starting the fade-out (total 6 seconds)
        } else {
            // Login failed
            showPopupMessage(result.error || "Invalid email or password. Please try again.", "error");

            // Clear the password field for better user experience
            document.getElementById("password").value = "";
        }
    } catch (error) {
        // Handle network or other errors
        showPopupMessage("An error occurred. Please try again later.", "error");
        console.error("Error:", error);
    }
});

// Function to show a pop-out block message
function showPopupMessage(message, type) {
    // Create a pop-up container
    const popup = document.createElement("div");
    popup.className = `popup-message ${type}`; // Apply the CSS class based on type
    popup.innerText = message;

    // Add the pop-up to the body
    document.body.appendChild(popup);

    // Automatically remove the pop-up after 2 seconds
    setTimeout(() => {
        popup.remove();
    }, 2000);
}
