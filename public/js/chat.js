const firebaseConfig = {
    apiKey: "AIzaSyDC8WYcM40gZWb7OSKv_IXO-z0g-9p75po",
    authDomain: "undercover-b8b4f.firebaseapp.com",
    projectId: "undercover-b8b4f",
    storageBucket: "undercover-b8b4f.appspot.com",
    messagingSenderId: "657020303413",
    appId: "1:657020303413:web:8768b4a802f3a716d1d97c",
    measurementId: "G-QNEWGRSRC3"
};

var socket = io();
firebase.initializeApp(firebaseConfig);
var id;
var title = document.getElementById('title');
/*
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user.uid);
        firebase.firestore().collection('users').doc(user.uid).get().then(doc => {
            id = doc.data()['id'];
            console.log(id);
          });
    } else {
        console.log("signed out");
    }
  });*/
const db = firebase.firestore();

socket.on('roomUsers', ({ room, users }) => {
    //outputRoomName(room);
    console.log(users);
    outputUsers(users);
  });
function outputUsers(users) {
    members.innerHTML = '';
    users.forEach(element => {
        var item = document.createElement('li');
        item.textContent = element['username'];
        members.appendChild(item);
        console.log(element['username']);
    });
    document.getElementById("loader").style.display="none";
}
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var uid = user.uid;
            db.collection('users').doc(uid).get().then(doc => {
            console.log(doc.data()['id']);
            id = doc.data()['id'];
            room = doc.data()['room']
            db.collection('rooms').doc(room).get().then(doc => {
              roomName = doc.data()['name'];
              roomNum = doc.data()['room'];
              console.log(roomName)
              document.getElementById('title').innerHTML = "<i style='font-size:16pt;'>#" + roomNum + "</i> " + roomName
            })
            socket.emit('joinRoom',socket.id, uid, id, room);
        })
    } else {
      // User is signed out
      // ...
      //return firebase.firestore().collection('users').doc(uid).update({online: false});
    }
  });

var logoutBTN = document.getElementById('logout');
logoutBTN.onclick = function() {
    window.location.assign("/");
  }

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

var members = document.getElementById('members');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    input.focus();
    if (input.value) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        
        today = yyyy + '/' + mm + '/' + dd;
        socket.emit('chat message', id + ": " + input.value);
        input.value = '';
        
    }

});
input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    e.preventDefault();
    if (event.key === "Enter") {
      // Trigger the button element with a click
      form.submit();
    }
  });
socket.on('message', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
});
