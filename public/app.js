var socket = io();

let messages = document.getElementById('messages');
let input = document.getElementById('msg_send');

let form_user = document.getElementById('form_user');
let username = document.getElementById('enter_user');

// submits a message when user types in and hits enter
function SubmitMessage(event) {
  // 13 is the keycode for "enter"
  if (input.value != null && event.keyCode == 13 && !event.shiftKey) {
    event.preventDefault(); 
    socket.emit('chat message', username.value + ': ' + input.value);
    input.value = '';
    
    return true;
  }
}

// event listener for username modal popup
form_user.addEventListener('submit', function(e) {
  e.preventDefault();
  if(username.value) {
    let modal = document.getElementById('modal_username');
    modal.style.display = "none";
    socket.emit('username', username.value);
  }
});

// adds a message to the chat when someone ends it
socket.on('chat message', function(msg) {
  let item = document.createElement('div');
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// updates online users when someone creates their username
socket.on('username', function (names) {
  online = document.getElementById('online_users');
  online.innerText = 'Online Users: ';
  console.log(names);

  for (const user in names) {
    console.log(`${user}: ${names[user]}`);
    online.innerText += ' ' + names[user] + ',';
  }
});