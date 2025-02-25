# Backend Codebase for the Chat WebApp

This folder contains the backend source code to handle requests from the Real-Time Chat Web Application.

It is developed using node.js and express along with typescript.

**More info about set up is available in the README.md** present the root of the repo.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Builds the source files in the development mode using `nodemon`.\
And launches the server on [http://localhost:3000](http://localhost:3000).

Postman was used to check the functionality of websocket(socket.io) connections along with message sending and listening events, and also to test the rest api endpoints to fetch the message history and user-creation endpoints.

### `npm run build`

Builds the app server for production to the `build` folder.

### `npm run start`

Start the app server from prod files built from `npm run build` and launches them into `http:localhost:3000`

## Suggestions for Testing Websockets and REST APIs

`Postman` is really helpful to test both socket.io events and rest api endpoints.

### Examples

Make sure backend server is up!

#### Websocket Testing

In `Postman` -> Click `New` and Select `Websocket` and Select `Socket.IO`

1.  Connecting websocket

        Enter `ws://localhost:3000` and connect

2.  Send user join request messgage

    ```
        {
            "jsonrpc": "2.0",
            "method": "join",
            "params": { "user_id": 1 },
            "id": 1
        }
    ```

    In backend console you can see the user activity. Similar to this another window can be opened in `Postman` -> connect another websocket -> send different user join message.

3.  When multiple users have joined, message from one user can be sent to backend and listening events can be activated in Postman. When message is sent, the user with corresponding id will receive the message and it can be observed in `Postman`.

    ```
        {
            "jsonrpc": "2.0",
            "method": "sendMessage",
            "params": { "senderId": 1, "receiverId": 2, "content": "user 1 to 2: test with js" },
            "id": 1
        }
    ```

#### REST API Testing

Similar to websockets, rest api endpoints can be tested as well.

e.g. this `GET` request will fetch all the messages between sender and receiver.

```
http://localhost:3000/messages/getmessages/?senderId=1&receiverId=2
```
