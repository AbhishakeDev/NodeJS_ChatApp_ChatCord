const express = require("express");
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const botName = "ChatChord Bot";

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when a client connects
io.on('connection', socket => {
    // console.log('New WS Connection...');

    //tasks when user joins a room
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //this emit is for the single client who just got connected that is just a welcome messagae
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'))

        //broadcast when a user connects(broadcast.emit bascially emits to all the client except the user like if he enters every one will know that he has joined the room except for him)
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    //Listen for the chat message from frontend
    socket.on('chatMessage', (msg) => {

        const user = getCurrentUser(socket.id);
        // console.log(msg);
        //now we want to emit this to everybody so we use io.emit()
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })


    //This runs braodcast whem some client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            //this emit is for every one just like when you message everyoneincluding you sees it
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            //here also we will set room users as a person disconnects we want to udpate the userlist
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })


})



const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));