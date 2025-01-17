// Check if the user is logged in
async function checkAuthStatus() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("User not logged in");
        }

        // Verify the token with the backend
        const response = await fetch('https://chibiv2.fly.dev/protected', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Send the token
            },
        });

        if (!response.ok) {
            // If response is not OK, handle it
            if (response.status === 401) {
                // Token expired or invalid
                console.log("Token is expired or invalid. Redirecting to login page.");
                window.location.href = "login.html";
                return;
            }
            throw new Error(`Failed to authenticate: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.user) {
            // User is logged in, show the dashboard content
            console.log("User is logged in. Showing dashboard content.");
            document.getElementById("dashboardContent").style.display = "block";
            document.getElementById("loadingPage").style.display = "none";
        } else {
            // User is not logged in, redirect to login page
            console.log("User is not logged in. Redirecting to login page.");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error checking auth status:", error);
        window.location.href = "login.html"; // Redirect to login page on error
    }
}

// Function to check if the user is on a mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Logout functionality
window.logout = async () => {
    try {
        // Remove the token from localStorage
        localStorage.removeItem('token');

        // Optionally, you can send a request to the backend to invalidate the token
        await fetch('https://chibiv2.fly.dev/logout', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
        });

        // Redirect to the appropriate login page based on the device type
        if (isMobileDevice()) {
            window.location.href = "/mobile/login.html"; // Redirect mobile users
        } else {
            window.location.href = "/login.html"; // Redirect desktop users
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
};

// Redirect functions
window.YRPRFL = () => {
    window.location.href = "prflepage.html";
};

window.settings = () => {
    window.location.href = "settings.html";
};

window.chat = () => {
    window.location.href = "chat.html";
};

window.friends = () => {
    window.location.href = "friends.html";
};

window.search = () => {
    window.location.href = "search.html";
};

// Check auth status when the page loads
checkAuthStatus();