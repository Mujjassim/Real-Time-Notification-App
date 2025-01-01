# Real-Time-Notification-App
Real-Time-Notification-App


## Features

- **User Authentication**: Users can log in to the system with email and password. The server generates and returns a JWT token upon successful login.
- **Notifications**: Allows fetching notifications, marking them as read, and pushing real-time notifications via WebSocket.
- **WebSocket Integration**: Uses Socket.IO to maintain a real-time connection with clients. The user's connection status is tracked in the database.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend server.
- **Express.js**: Web framework for building REST APIs.
- **Socket.IO**: Real-time communication between the server and clients.
- **MongoDB**: NoSQL database for storing user and notification data.
- **JWT**: JSON Web Tokens for secure user authentication.
- **Mongoose**: ODM for interacting with MongoDB.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Mujjassim/Real-Time-Notification-App.git
cd Real-Time-Notification-App.git
```
### 2. cd  BACKEND
npm install

### 3. Set up environment variables
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-secret-key

### 4. Run the server
npm start

### API Endpoints
1. POST /api/auth/login
Description: Logs in a user and returns a JWT token.
Body:
{
  "email": "user@example.com",
  "password": "password"
}
Response:
{
  "token": "jwt-token",
}

2. POST /api/auth/register
Description: Register user
Body:
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "role": "User"
}
Response:
{
    "message": "User registered successfully"
}

3. GET /api/notifications
Description: Retrieves all notifications for the authenticated user.
Headers:
{
  "Authorization": "Bearer jwt-token"
}
Response:
[
  {
    "message": "You have a new message.",
    "read": false
  },
  {
    "message": "Your subscription is about to expire.",
    "read": true
  }
]

4. PUT /api/notifications/mark-read
Description: Marks all notifications as read for the authenticated user.
Headers:
{
  "Authorization": "Bearer jwt-token"
}
Response:
{
  "message": "Notifications marked as read."
}

5. PUT /api/notifications/role/User
Description: Send notifications to that type.
Headers:
{
  "Authorization": "Bearer jwt-token"
}
Body:
{
  "message": "Hello"
}

if connect to the socket and should emit the event 
"notification:acknowledge" in return.

6. PUT /api/notifications/user/:id
Description: Send notifications to user with that id only.
Headers:
{
  "Authorization": "Bearer jwt-token"
}

Body:
{
  "message": "Hello"
}

Response:
{
  "message": "Notifications marked as read."
}

connect with socket on PORT as mention in .env
and pass token it header.