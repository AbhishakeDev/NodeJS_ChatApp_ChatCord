const users = [];

//Join user to chat

function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id)
}

//user leaves the chat

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    //find index returns -1 if index not found
    if (index !== -1) {
        //splice removes the index that u specify and returns the array with the deleted elements so over here we return the arrays first element as it is the only deleted element
        return users.splice(index, 1)[0];
    }
}

//Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};