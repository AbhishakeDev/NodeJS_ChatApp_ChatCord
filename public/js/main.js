const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from Url

const { username, room } = Qs.parse(location.search, {
    //this is written to remove the non alphanumerics from the username and th room
    ignoreQueryPrefix: true
})

// console.log(username, room);

//Join chatroom using the room that we got above
socket.emit('joinRoom', { username, room });

//get room and users and set into the frontend

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

// getting message back from server inorder to print it back to dom
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down if messsage exceed the view
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//on message submit

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    //elements.msg is the input element with id msg that actually is the input where we enter the message
    const msg = e.target.elements.msg.value;
    // console.log(msg);

    //emittimg a message to the server
    socket.emit('chatMessage', msg)


    //clear input after user send a message
    e.target.elements.msg.value = '';
    e.target.elements.focus();
})

//Output message to the dom

const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    const { text, username, time } = message;
    div.innerHTML = `
    <p class="meta">${username} <span>${time}</span></p>
          <p class="text">
            ${text}
          </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add roomname to dom 

function outputRoomName(room) {
    roomName.innerText = room;
}

//Add users to dom

function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}