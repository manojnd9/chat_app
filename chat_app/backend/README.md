# Backend Codebase for the Chat WebApp

This folder contains the backend source code to handle requests from the Real-Time Chat Web Application.

It is developed using node.js and express along with typescript.

More info about set up is available in the README.md present the root of the repo.

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
