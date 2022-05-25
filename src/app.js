const path = require('path');
const express = require('express');
const socket = require('socket.io');
const app = express();
const session = require('express-session');
const port = process.env.PORT || 3000;


var mysql = require('mysql'), // node-mysql module
  myConnection = require('express-myconnection'), // express-myconnection module
  dbOptions = {
    host: 'localhost',
    user: 'root',
    password: 'ThisIsMyPassword123',
    port: 3306,
    database: 'pokerface'
  };

//Import routes
const routes = require('./routes/routes')


// settings
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(myConnection(mysql, dbOptions, 'single'));



app.use('/public', express.static(__dirname + '/public'));

//Middleware
app.use(session({
  secret: "Mi secreto",
  resave: true,
  saveUninitialized: true
}))

//Routes
app.use('/', routes);

// Server selection
const server = app.listen(port, () => {
  console.log('Listening on port', port);
});


// Socket management
const io = socket(server);
const connectHandler = require('./handlers/connectHandler');
const disconnectHandler = require('./handlers/disconnectHandler');
const gameHandler = require('./handlers/gameHandler');
const Game = require('./logic/Game');


var game = new Game(2);
var table = {
  players: {},
  allIn:{},
  onGame: false,
  money: {},
  pot: 0,
  bet: 0,
  checked: {}
}


const onConnection = (socket) => {
  connectHandler(io, socket);
  gameHandler(io, socket, table, game)
  disconnectHandler(io, socket, table, game);
}

io.on("connect", onConnection);

