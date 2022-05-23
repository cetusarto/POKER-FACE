var socket = io()
var ready = false;
var enough = false;
var cards;


var readyButton;

window.addEventListener('load', function () {
    readyButton = document.getElementById("ready")
})


//Functions
function readyToPlay() {
    readyButton.style.backgroundColor = "green";
    if (!ready) {
        socket.emit("game::playerReady")
    }
    ready = true;
}

function test() {
    socket.emit("test")
}


//Socket
socket.on("connect", () => { })
socket.on("game::starting", () => {
    socket.emit("game::getFirstCards")
})
socket.on("game::gettingFirstCards", (cards) => {
    this.cards = cards;
})


