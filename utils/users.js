
const users = [];
// Join user to chat
function userJoin(id, uid, username, room) {
  
  const user = { id, uid, username, room };
  if(users.filter(user => user.uid === uid).length >1){
    console.log('SAME UID');
    const index = users.findIndex(user => user.uid === uid);
    return users.splice(index, 1)[0];
  }
  if(users.find(user => user.id === id)){
    return user;
  }
    
    users.push(user);
    console.log("push");
    console.log(users);
  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

// Get room users
function getUsers() {
  return users;
}
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getUsers
};