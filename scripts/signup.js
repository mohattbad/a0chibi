// Add event listener to the sign-up form
document.getElementById('signup-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const retypePassword = document.getElementById('retype-password').value;
    const message = document.getElementById('message');

    // Reset message
    message.textContent = '';
    message.style.display = 'none';

    // Basic validation
    if (password !== retypePassword) {
        showMessage("Passwords do not match!", "red");
        return;
    }

    if (password.length < 8) {
        showMessage("Password must be at least 8 characters long!", "red");
        return;
    }

    try {
        const response = await fetch("https://chibiv2.fly.dev/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullName, email, password, retypePassword }),
        });

        const result = await response.json();

        if (response.ok) {
            // Show success message with a login link
            showMessage("Account created successfully! <a href='login.html'>You can login now</a>", "green");

            // Clear the form (optional)
            document.getElementById('signup-form').reset();
        } else {
            // Handle errors
            showMessage(result.error || "An error occurred. Please try again.", "red");
        }
    } catch (error) {
        console.error("Error during sign-up:", error);
        showMessage("An error occurred. Please try again.", "red");
    }
});

// Function to show the pop-out message with animation
function showMessage(text, color) {
    const message = document.getElementById('message');
    message.innerHTML = text; // Use innerHTML to render the link
    message.className = `message ${color}`; // Set the class for color
    message.style.display = 'block';

    // Remove the message after the animation ends
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000); // Adjust the timeout to match the fadeOut animation duration
}