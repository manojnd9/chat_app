# Real-Time Chat WebApp

## Project Description

This is a real-time chat web application built using **react and typescript**.
The application allows users to send messages in real-time while displaying **animated 3D icon** whenever a message is sent. It also displays the chat history between two users (sender and receiver).

## Tech Stack Used

### Front-End

- React with Typescript
- Redux Toolkit for state-management
- React Router for Navigation in browser
- TailwindCss for styling
- Socket.IO Client for real-time communication (with json-rpc format on payload)
- Three.js and React-three/fiber for 3D animations

### Back-End

- Node.js with Express and Typescript
- Prisma ORM with PostgreSQL database
- Socket.IO for Websocket communication
- JSON-RPC-2.0 for structured messaging and socket.io event/method handling
- Docker-Compose for containerising the PostgreSQL database

## Installation and Setup

### Step-1: Clone the Repository

```sh
git clone git@github.com:manojnd9/chat_app.git
cd chat_app
```

NOTE: All the `make` commands mentioned below are in this [Makefile](Makefile) in root folder.

#### ENVIRONMENT FILE

- There is example file `.env.example` in `./chat_app/backend/` showing examples of required env variables to be added to .env file before starting with backend set-up.
- Create a new .env and paste these there and adapt as per your need.
- You can also keep same values to run the backend locally.

### Step-2.1: Set-up Backend

This step involves **installing dependencies, creating database, running prisma migrations to create database schema**.

#### Quick Backend Setup and Server Start (Recommended)

For the first time execute following command to set-up backend and start the server.

```sh
make backend-setup-firsttime
```

NOTE: About Database:

- Since authentication and add/create user functionality is not there in front-end,
  and backend has been written to validate users in database before joining the chat-room
  or sending/getting messages, a hacky fix is provided in the backend to create some seed users when
  backend is created for first time and database is empty.
- This will align with the front-end fix of three hard-coded users.

#### Detailed Backend Setup (Skip this if backend is already setup)

- Install Requirements

```sh
make backend
```

- Set up database with docker-compose

```sh
make db
```

- Run prisma db schema migrations

```sh
make db-migrate
```

- Start prisma client

```sh
make prisma-generate
```

### Step-2.2: Start Backend Server

- Start Backend Server (Dev)

```sh
make backend-start-dev
```

- Start Backend Server (Prod)

```sh
make backend-start-prod
```

### Step-3.1: Set-up Frontend

This step involves **installing dependencies, starting the frontend**.

#### Quick Frontend Setup and Start (Recommended)

To **quickly install dependencies and start the frontend**, run:

```sh
make frontend-setup-firsttime
```

#### Detailed Frontend Setup (Skip this if frontend is already setup)

- Install Requirements

```sh
make frontend
```

### Step-3.2: Start Frontend

- Start Frontend (Dev)

```sh
make frontend-start-dev
```

- Start Frontend (Prod)

```sh
make frontend-start-prod
```

## Step-4: Running the Full Application

After setting up both frontend and backend, follow these steps in order to start using the chat application in the browser/s:

- Open **two browser windows** (e.g., Safari & Chrome) and open the frontend served on `http://localhost:<available port>`.

  - When you first open the app, you need to **select a user** from the home screen.

- Select **different users** in each window.

  - The chat page opens, showing **available users to chat with**

- Choose another user from the list to start a private chat.

  - Click on a user, **type a message**, and press **Send**.

- The message should appear instantly.

- **Messages persist in the database** and reload when reopening the chat.

  - The message history is loaded when opening the chat.
  - A **3D icon animation** will appear when a message is sent.

---

## Features Implemented

- **Real-time messaging** with WebSockets & JSON-RPC
- **Messages are stored** in PostgreSQL using Prisma
- **Message history loads automatically** when opening a chat
- **Users join WebSocket rooms automatically**
- **Animated 3D icons appear when sending a message**

## Known Issues & Limitations

- **Refreshing the `/chat` page (once opened after user selection in frontend) causes a route issue** (React Router doesn’t handle refresh properly).
- If backend restarts, front-end connects back, but there is issue on user rejoining. And the browser should be refreshed i.e. come from user selection page.
- **No authentication and Create-User functionality is implemented yet** (users are currently hardcoded).

## Future Improvements

- **Authentication and Signup Functionality**
- **Adding contacts or own set of receivers**
- **Unit and Integration Testing**
- **Deploy the app and work on load**

## License

This project is part of a **coding challenge** and is for evaluation purposes only
