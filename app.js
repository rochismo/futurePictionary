const http = require('http');
const express = require('express');
const app = express();
const socket = require("socket.io");
const nicknames = [];

const port = 8080;

const handler = () => {
    console.log("Listening on port: " + port);
}
const server = app.listen(port, handler);


// Static files

app.use(express.static('public'));

// Socket setup

const io = socket(server);

const handleConnection = (socket) => {
    console.log("Connection with: " + socket.id);

    // Handle chat event
    socket.on('chat', function (data) {
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    });

    // Handle emptying the feedback
    socket.on('empty', function () {
        console.log("Deleting stuff");
        socket.broadcast.emit('empty', null);
    });

    socket.on("login", function (data) {
        socket.nickname = data
        nicknames.push(socket.nickname);
        io.sockets.emit('usernames', nicknames);
    });

    socket.on("notifyAll", function (data) {
        io.sockets.emit("notifyAll", data);
    })

    socket.on('disconnect', function () {
        if (!socket.nickname) return;
        io.sockets.emit("leave", socket.nickname);
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        io.sockets.emit('usernames', nicknames);
    })
};


io.on('connection', handleConnection);