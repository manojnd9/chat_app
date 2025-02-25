# System Architecture and Approach

## High Level Architecture Diagram

Overview of how frontend, backend and database interact with each other.

```
+--------------------+            +----------------------+
|    Frontend        |  <---> WS  |   Backend (Node.js)  |
| React + Redux      |    API     |   Express + Prisma   |
| Typescript         |            |   Typescript         |
| Tailwind + Three.js|  REST API  |   PostgreSQL DB      |
+--------------------+            +----------------------+
                                              |
                                              v
                                    +-------------------+
                                    |  PostgreSQL DB    |
                                    +-------------------+
```

## Message flow via Websockets (Socket.IO)

```
User 1 (Frontend)  --->  WebSocket  --->  Backend (Socket.IO)
   |                                          |
   | -----> JSON-RPC "join" event ------------|
   |                                          |
   | -----> JSON-RPC "sendMessage" event ---->|
   |                                          |
   | <----- JSON-RPC "newMessage" event <---- |
   |
User 2 (Frontend)  <--- WebSocket  <--- Backend (Socket.IO)

```

## Database Schema (Prisma + PostgreSQL)

```
+-----------+         +-----------+
|  User    |         | Message  |
+-----------+         +-----------+
| id        |   <-->  | id        |
| username  |         | senderId  |
+-----------+         | receiverId|
                      | content   |
                      | createdAt |
                      +-----------+

```
