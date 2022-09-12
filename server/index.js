//LIBRARIES
const express = require("express");
const app = express();
const http = require("http"); //comes with express
const cors = require("cors");
const { Server } = require("socket.io"); //curly braces since it comes under socket.io library

//RESOLVES ERRORS
app.use(cors());

//CREATE SERVER
const server = http.createServer(app); //pass an express app in the parameter

//INSTANTIATE SOCKET.IO CONNECTION
const io = new Server(server, { //creates a new instance of the http server
    cors : { //SOLVES MAJOR CORS ERRORS AFTER THE UPDATE
        origin : "http://localhost:3000", //ReactJS runs on port 3000 //https://connect-socketio-devsoc.netlify.app
        methods : ["GET", "POST"], //work only with these methods
    },
}); 

// LISTEN TO CONNECTION OR DISCONNECT EVENTS
io.on("connection", (socket) => { //listens to connections
    console.log(`User connected : ${socket.id}`); //logs the ID of users who connected

    socket.on("join_room", (data) => { //accepts the room ID from the frontend
        socket.join(data); //joins the room
        console.log(`User with ID : ${socket.id} joined room ID : ${data}`)
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => { //listens to disconnect events
        console.log("User disconnected.", socket.id); //logs the ID of users who disconnected
    })
});

//RUN SERVER
server.listen(3001, () => { //port 3001 since ReactJS runs on port 3000
    console.log("Server running."); //acknowledgement that the server is running
});

