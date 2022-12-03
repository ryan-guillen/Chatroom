var socket = io();

let p1 = document.getElementById('p1_buttons');
let p2 = document.getElementById('p2_buttons');

function rpsSelected(p, choice) {
    socket.emit('rps_select', p, choice);
}

socket.on('p1_chosen', () => {
    p1.querySelectorAll('button').forEach((b) => {
        b.style.backgroundColor = 'gray';
        b.disabled = true;
    })
    document.getElementById('waiting1').textContent = 'Waiting for Player 2...'
});

socket.on('p2_chosen', () => {
    p2.querySelectorAll('button').forEach((b) => {
        b.style.backgroundColor = 'gray';
        b.disabled = true;
    })
    document.getElementById('waiting2').textContent = 'Waiting for Player 1...'
});

socket.on('resetRPS', () => {
    p1.querySelectorAll('button').forEach((b) => {
        b.style.backgroundColor = "rgb(226, 96, 35)";
        b.disabled = false;
    })
    document.getElementById('waiting1').textContent = '';

    p2.querySelectorAll('button').forEach((b) => {
        b.style.backgroundColor = 'rgb(226, 96, 35)';
        b.disabled = false;
    })
    document.getElementById('waiting2').textContent = '';
});