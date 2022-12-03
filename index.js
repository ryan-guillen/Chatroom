const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

let online = [];
let users = {};
let p1_played, p2_played = false;
let p1_choice, p2_choice;

app.use(express.static('public')); // static public allows files in public to be grabbed by index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('-> ' + socket.id + ': user connected ' + 
    'with ID: ' + socket.handshake.address);
  online.push(socket.id);
  console.log(online);
  EmitUsers();

  socket.on('disconnect', () => {
    console.log('user disconnected');

    online.splice(online.indexOf(socket.id), 1);
    DeleteUser(socket.id);
    console.log(online);
  });

  socket.on('chat message', (msg) => 
  {    
    console.log('message: ' + msg); 
    io.emit('chat message', msg); 
  });

  socket.on('username', (username) =>
  {
    AddUser(socket.id, username);
  });

  socket.on('rps_select', (p, choice) => {
    console.log(p, choice);
    RPS(p, choice); 
    //return true;
  });
});

// adds a user's nickname to users
function AddUser(id, username) {
  users[id] = username;
  EmitUsers();
}

// deletes a user's nickname from users
function DeleteUser(id) {
  delete users[id];
  EmitUsers();
}

// updates the client and sends them all current users
function EmitUsers() {
  io.emit('username', users);
  console.log('-> Current Users:');
  console.log(users);
}

function RPS(p, choice) {
  if (!p1_played || !p2_played) {
    if(p == 1) {
      p1_played = true;
      p1_choice = choice;
      io.emit('p1_chosen');
    }
    else {
      p2_played = true;
      p2_choice = choice;
      io.emit('p2_chosen');
    }
  }
  if (p1_played && p2_played) {
    p1_played = false;
    p2_played = false;
    if (p1_choice == p2_choice) {
      ConcludeRPS(0);
    }
    else if ((p1_choice == 'scissors' && p2_choice == 'paper')
      || (p1_choice == 'rock' && p2_choice == 'scissors')
      || (p1_choice == 'paper' && p2_choice == 'rock')) {
        ConcludeRPS(1);
    }
    else ConcludeRPS(2);
    p1_choice = null;
    p2_choice = null;
  }
}

function ConcludeRPS(result) {
  if(result == 0) io.emit('chat message', 'TIE!'); 
  if(result == 1) io.emit('chat message', 'Player 1 won!'); 
  if(result == 2) io.emit('chat message', 'Player 2 won!'); 
  io.emit('resetRPS');
}

server.listen(80, () => 
{ console.log('listening on *:80'); });