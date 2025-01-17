// Function to check if the user is logged in (protected route)
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if no token
        return;
    }

    try {
        const response = await fetch('https://chibiv2.fly.dev/protected', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        console.log('User is authenticated:', data.user);
    } catch (error) {
        console.error('Authentication error:', error);
        window.location.href = 'login.html'; // Redirect to login on error
    }
}

// Function to fetch and display the user's profile data
async function fetchProfileData() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if no token
        return;
    }

    try {
        const response = await fetch('https://chibiv2.fly.dev/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const profileData = await response.json();
        displayProfileData(profileData); // Display the fetched data
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
}

// Function to display the user's profile data
function displayProfileData(profileData) {
    document.getElementById('profileName').innerText = profileData.fullName || 'No Name';
    document.getElementById('profileTitle').innerText = profileData.title || 'No Title';
    document.getElementById('profileBio').innerText = profileData.bio || 'No Bio';
    document.getElementById('profileEmail').innerText = profileData.email || 'No Email';
    document.getElementById('profilePhone').innerText = profileData.phone || 'No Phone';
    document.getElementById('profileLocation').innerText = profileData.location || 'No Location';
    document.getElementById('DISCORDLink').href = profileData.discord || '#';
    document.getElementById('FACEBOOKLink').href = profileData.facebook || '#';
    document.getElementById('INSTAGRAMLink').href = profileData.instagram || '#';
    document.getElementById('profileImage').src = profileData.profilePicture || 'img/user.webp';
}

// Function to sanitize the payload by replacing undefined values with null
function sanitizePayload(data) {
    return {
        fullName: data.fullName || null,
        title: data.title || null,
        bio: data.bio || null,
        email: data.email || null,
        phone: data.phone || null,
        location: data.location || null,
        discord: data.discord || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        profilePicture: data.profilePicture || null,
    };
}

// Function to fetch and merge profile data before updating
async function updateProfileData(updatedData) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if no token
        return;
    }

    try {
        // Fetch the current profile data
        const response = await fetch('https://chibiv2.fly.dev/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const currentProfileData = await response.json();

        // Merge the current profile data with the updated data
        const mergedData = {
            ...currentProfileData, // Existing data
            ...updatedData, // New updates
        };

        // Sanitize the payload to replace undefined values with null
        const sanitizedData = sanitizePayload(mergedData);
        console.log('Sending merged and sanitized data:', sanitizedData); // Log the payload

        // Send the merged data to the backend
        const updateResponse = await fetch('https://chibiv2.fly.dev/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedData),
        });

        if (!updateResponse.ok) {
            const errorResponse = await updateResponse.json(); // Log the error response from the backend
            console.error('Backend error:', errorResponse);
            throw new Error('Failed to update profile data');
        }

        const result = await updateResponse.json();
        console.log('Profile updated successfully:', result);
        fetchProfileData(); // Refresh the profile data after update
    } catch (error) {
        console.error('Error updating profile data:', error);
    }
}

// Function to handle profile picture change
document.getElementById('imageUpload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profileImage').src = e.target.result;
            updateProfileData({ profilePicture: e.target.result }); // Update profile picture in backend
        };
        reader.readAsDataURL(file);
    }
});

// Function to handle name and title editing
document.getElementById('editNameTitleBtn').addEventListener('click', function () {
    document.getElementById('nameInput').value = document.getElementById('profileName').innerText;
    document.getElementById('titleInput').value = document.getElementById('profileTitle').innerText;
    document.getElementById('nameInput').style.display = 'block';
    document.getElementById('titleInput').style.display = 'block';
    document.getElementById('editNameTitleBtn').style.display = 'none';
    document.getElementById('saveNameTitleBtn').style.display = 'block';
});

document.getElementById('saveNameTitleBtn').addEventListener('click', function () {
    const updatedData = {
        fullName: document.getElementById('nameInput').value || null, // Replace undefined with null
        title: document.getElementById('titleInput').value || null, // Replace undefined with null
    };
    updateProfileData(updatedData); // Send updated data to backend

    document.getElementById('nameInput').style.display = 'none';
    document.getElementById('titleInput').style.display = 'none';
    document.getElementById('editNameTitleBtn').style.display = 'block';
    document.getElementById('saveNameTitleBtn').style.display = 'none';
});

// Function to handle bio editing
document.getElementById('editBioBtn').addEventListener('click', function () {
    document.getElementById('bioInput').value = document.getElementById('profileBio').innerText;
    document.getElementById('bioInput').style.display = 'block';
    document.getElementById('profileBio').style.display = 'none';
    document.getElementById('editBioBtn').style.display = 'none';
    document.getElementById('saveBioBtn').style.display = 'block';
});

document.getElementById('saveBioBtn').addEventListener('click', function () {
    const updatedData = {
        bio: document.getElementById('bioInput').value || null, // Replace undefined with null
    };
    updateProfileData(updatedData); // Send updated data to backend

    document.getElementById('bioInput').style.display = 'none';
    document.getElementById('profileBio').style.display = 'block';
    document.getElementById('editBioBtn').style.display = 'block';
    document.getElementById('saveBioBtn').style.display = 'none';
});

// Function to handle contact information editing
document.getElementById('editContactBtn').addEventListener('click', function () {
    document.getElementById('emailInput').value = document.getElementById('profileEmail').innerText;
    document.getElementById('phoneInput').value = document.getElementById('profilePhone').innerText;
    document.getElementById('locationInput').value = document.getElementById('profileLocation').innerText;
    document.getElementById('contactInputs').style.display = 'block';
    document.getElementById('editContactBtn').style.display = 'none';
    document.getElementById('saveContactBtn').style.display = 'block';
});

document.getElementById('saveContactBtn').addEventListener('click', function () {
    const updatedData = {
        email: document.getElementById('emailInput').value || null, // Replace undefined with null
        phone: document.getElementById('phoneInput').value || null, // Replace undefined with null
        location: document.getElementById('locationInput').value || null, // Replace undefined with null
    };
    updateProfileData(updatedData); // Send updated data to backend

    document.getElementById('contactInputs').style.display = 'none';
    document.getElementById('editContactBtn').style.display = 'block';
    document.getElementById('saveContactBtn').style.display = 'none';
});

// Function to handle social media links editing
document.getElementById('editSocialBtn').addEventListener('click', function () {
    document.getElementById('DSDInput').value = document.getElementById('DISCORDLink').href;
    document.getElementById('FACEInput').value = document.getElementById('FACEBOOKLink').href;
    document.getElementById('INSTAInput').value = document.getElementById('INSTAGRAMLink').href;
    document.getElementById('socialInputs').style.display = 'block';
    document.getElementById('editSocialBtn').style.display = 'none';
    document.getElementById('saveSocialBtn').style.display = 'block';
});

document.getElementById('saveSocialBtn').addEventListener('click', function () {
    const updatedData = {
        discord: document.getElementById('DSDInput').value || null, // Replace undefined with null
        facebook: document.getElementById('FACEInput').value || null, // Replace undefined with null
        instagram: document.getElementById('INSTAInput').value || null, // Replace undefined with null
    };
    updateProfileData(updatedData); // Send updated data to backend

    document.getElementById('socialInputs').style.display = 'none';
    document.getElementById('editSocialBtn').style.display = 'block';
    document.getElementById('saveSocialBtn').style.display = 'none';
});

// Check authentication status and fetch profile data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus(); // Ensure the user is logged in
    fetchProfileData(); // Fetch and display the profile data
});