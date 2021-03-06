const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3000;

const server = express();

let httpserver = server.listen(PORT, () => console.log(`Listening on ${PORT}`));

server.get('/client', function (req, res) { res.sendFile(path.resolve(__dirname, './client.html'))});
server.get('/streamer', (req, res) => res.sendFile(path.resolve(__dirname, './streamer.html')));


const { Server }= require('ws');
const wsServer = new Server({ server: httpserver });

// array of connected websocket clients
let connectedClients = [];

wsServer.on('connection', (ws, req) => {
    console.log('Connected');
    // add new connected client
    connectedClients.push(ws);
    // listen for messages from the streamer, the clients will not send anything so we don't need to filter
    ws.on('message', data => {
        // send the base64 encoded frame to each connected ws
        connectedClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) { // check if it is still connected
                ws.send(data); // send
            } else { // if it's not connected remove from the array of connected ws
                connectedClients.splice(i, 1);
            }
        });
    });
});

// HTTP stuff


