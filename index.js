var admin = require("firebase-admin");

var serviceAccount = require("./undercover-b8b4f-firebase-adminsdk-rj5ia-f3f65742b9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://undercover-b8b4f-default-rtdb.asia-southeast1.firebasedatabase.app/"
});
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
var express = require('express');
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var router = express.Router();
const formatMessage = require('./utils/messages');
app.use(express.urlencoded({ extended: true }))
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getUsers } = require('./utils/users');
const { Socket } = require('dgram');
const { database } = require("firebase-admin");
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

var fireData = admin.database();

fireData.ref('todos').once('value', function (snapshot) {
  console.log(snapshot.val());
})
// create application/json parser
var jsonParser = bodyParser.json()

var tempUser = "";
var roomno = 1;
console.log('hello world');
io.on('connection', (socket) => {
  console.log(socket.id + ' connected')
  
  console.log('rooms: ' + getActiveRooms(io));

    socket.on('disconnect', function () {
      console.log(socket.id +' disconnect');
      const user = userLeave(socket.id);
      // Send users and room info
      if (user) {
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
      
    });
    socket.on('loadRooms',function(){
      io.to(socket.id).emit('getRooms', getActiveRooms(io));
    })
    socket.on('joinRoom', (id, uid, username, room) => {
      const user = userJoin(id, uid, username, room);
      console.log("user: " + user.username);
      socket.join(room);
      console.log(username+" joinRoom : " + room);
      
      io.to(room).emit('roomUsers', {
        room: room,
        users: getRoomUsers(room)
      });
      
    });
    socket.on('chat message', msg => {
      const user = getCurrentUser(socket.id);
      console.log(user);
      io.to(user.room).emit('message', msg);
    });
  });
  
 
  app.get('/chat', urlencodedParser, function (req, res) {
    console.log('get the post!');
    res.sendFile('public/chat.html', { root: __dirname })
  });
  http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
  });
/*
router.get('/public/chat.html', (req, res) => {
    console.log('hello world') // { item: 'apple', quantity: '3' }
})*/
function getActiveRooms(io) {
  // Convert map into 2D list:
  // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
  const arr = Array.from(io.sockets.adapter.rooms);
  // Filter rooms whose name exist in set:
  // ==> [['room1', Set(2)], ['room2', Set(2)]]
  const filtered = arr.filter(room => !room[1].has(room[0]))
  // Return only the room name: 
  // ==> ['room1', 'room2']
  const res = filtered.map(i => i[0]);
  return res;
}
