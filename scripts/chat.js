const token = localStorage.getItem('token'); // Assume the token is stored after login
if (!token) {
  alert('You must log in first.');
  window.location.href = '/login.html'; // Redirect to login page
}

const API_BASE_URL = 'https://chibiv2.fly.dev';

// Get the friend ID from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const friendId = urlParams.get('friendId');

if (!friendId) {
  alert('No friend selected.');
  window.location.href = '/friends.html'; // Redirect back to friends list
}

let selectedFriendId = friendId;

// Fetch and display messages
async function fetchMessages() {
  try {
    const response = await fetch(`https://chibiv2.fly.dev/messages?otherUserId=${selectedFriendId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages.');
    }

    const messages = await response.json();
    const chatMessages = document.getElementById('chat-messages');

    // Clear the chat before populating it
    chatMessages.innerHTML = '';

    // Populate the chat with messages
    messages.forEach((msg) => {
      const messageDiv = document.createElement('div');
      messageDiv.innerHTML = `
        <strong>${msg.fromUserId === selectedFriendId ? 'Them' : 'You'}:</strong> ${msg.message}
      `;
      chatMessages.appendChild(messageDiv);
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    alert('Failed to fetch messages. Please try again later.');
  }
}

// Send a message to the selected friend
document.getElementById('send-message-btn').addEventListener('click', async () => {
  const message = document.getElementById('message-input').value;
  if (!message) {
    alert('Please enter a message.');
    return;
  }

  try {
    const response = await fetch(`https://chibiv2.fly.dev/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ toUserId: selectedFriendId, message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message.');
    }

    document.getElementById('message-input').value = ''; // Clear input
    fetchMessages(); // Refresh messages
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Failed to send message. Please try again later.');
  }
});

// Fetch messages when the page loads
fetchMessages();