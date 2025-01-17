const token = localStorage.getItem('token'); // Assume the token is stored after login

// Function to check if the user is authenticated
async function checkAuth() {
  if (!token) {
    // No token found, redirect to login
    alert('You must log in first.');
    window.location.href = '/login.html';
    return;
  }

  try {
    // Verify the token by calling the /protected endpoint
    const response = await fetch(`https://chibiv2.fly.dev/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token is invalid or expired, redirect to login
      throw new Error('Invalid or expired token.');
    }

    // Token is valid, allow access to the page
    initializePage();
  } catch (error) {
    console.error('Authentication error:', error);
    alert('You must log in first.');
    window.location.href = '/login.html';
  }
}

// Function to initialize the page (only called if the user is authenticated)
function initializePage() {
  fetchUsers();
  fetchPendingInvites();
  fetchFriends();
}

// Function to fetch all users (excluding the current user)
async function fetchUsers() {
  try {
    const response = await fetch(`https://chibiv2.fly.dev/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users.');
    }

    const users = await response.json();
    const usersList = document.getElementById('users-list');

    // Clear the list before populating it
    usersList.innerHTML = '';

    // Populate the list with users
    users.forEach((user) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src="${user.profilePicture}" alt="${user.fullName}" style="width: 50px; height: 50px; border-radius: 50%;" />
        <span>${user.fullName}</span>
        <button onclick="sendFriendInvite('${user.id}')">Send Friend Invite</button>
      `;
      usersList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    alert('Failed to fetch users. Please try again later.');
  }
}

// Send a friend invite
async function sendFriendInvite(toUserId) {
  try {
    const response = await fetch(`https://chibiv2.fly.dev/friend-invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ toUserId }),
    });
    const result = await response.json();
    alert(result.message);
    fetchPendingInvites(); // Refresh pending invites
  } catch (error) {
    console.error('Error sending friend invite:', error);
  }
}

// Fetch pending friend invites
async function fetchPendingInvites() {
  try {
    const response = await fetch(`https://chibiv2.fly.dev/friend-invites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const invites = await response.json();
    const invitesList = document.getElementById('invites-list');
    invitesList.innerHTML = invites
      .map(
        (invite) => `
        <li>
          From: ${invite.fromUserName}
          <img src="${invite.fromUserPhoto}" alt="${invite.fromUserName}" style="width: 50px; height: 50px; border-radius: 50%;" />
          <button onclick="respondToInvite('${invite.id}', 'accepted')">Accept</button>
          <button onclick="respondToInvite('${invite.id}', 'rejected')">Reject</button>
        </li>
      `
      )
      .join('');
  } catch (error) {
    console.error('Error fetching invites:', error);
  }
}

// Respond to a friend invite
async function respondToInvite(inviteId, response) {
  try {
    const result = await fetch(`https://chibiv2.fly.dev/friend-invite-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ inviteId, response }),
    });
    alert(`Invite ${response}.`);
    fetchPendingInvites(); // Refresh pending invites
    fetchFriends(); // Refresh friends list
  } catch (error) {
    console.error('Error responding to invite:', error);
  }
}

// Fetch the current user's friends
async function fetchFriends() {
  try {
    const response = await fetch(`https://chibiv2.fly.dev/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const friends = await response.json();
    const friendsList = document.getElementById('friends-list');
    friendsList.innerHTML = friends
      .map(
        (friend) => `
        <li>
          <img src="${friend.profilePicture}" alt="${friend.fullName}" style="width: 50px; height: 50px; border-radius: 50%;" />
          <span>${friend.fullName}</span>
          <a href="chat.html?friendId=${friend.id}">
            <button>Chat</button>
          </a>
        </li>
      `
      )
      .join('');
  } catch (error) {
    console.error('Error fetching friends:', error);
  }
}

// Check authentication when the page loads
checkAuth();