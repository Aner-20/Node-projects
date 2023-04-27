const socket = io('http://localhost:3000');
const name = prompt('What is your name?')

const firstPlayer = document.querySelector('.player1');
const secondPlayer = document.querySelector('.player2');
const buttons = document.querySelectorAll('button');
const firstPlayerPick = document.querySelector('.player1-pick');
const secondPlayerPick = document.querySelector('.player2-pick');
const sendInfo = document.querySelector('#send-info');


socket.emit('new-user', name)

socket.on('chat-message', data => {
    console.log(data)
})

socket.on('user-connected', name => {
    showInfo(name)
})


sendInfo.addEventListener('submit', e => {
    e.preventDefault();
    
})

function showInfo(message){
    console.log(message)
}

buttons.forEach((button, id) => {
    button.addEventListener('click', () => {
        switch(id){
            case 0:
                /*const info = button.textContent;
                socket.emit('send-info', info)*/
                console.log("ROCk")

                break;

            case 1:
                console.log("PAPER"); 
                break;

            case 2:
                console.log("SCISSORS");
                break;

        }
    })
})