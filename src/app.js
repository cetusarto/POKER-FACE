const path = require('path');
const express = require('express');


const socket = require('socket.io');
const app = express();
const session = require('express-session')
const port = process.env.PORT || 3000;

//Import routes
const gameRoutes = require('./routes/gameRoutes')


// settings
app.set('port', port);
app.use(express.static(path.join(__dirname, 'views')));


//Middleware
app.use(session({
  secret: "Mi secreto",
  resave: true,
  saveUninitialized: true
}))

//Serves all the request which includes /images in the url from Images folder
app.use('/public', express.static(path.join(__dirname,'public')));


//Routes
app.use('/', gameRoutes);


// Server selection
const server = app.listen(port, () => {
  console.log('Listening on port', port);
});


// Socket management
const io = socket(server);



io.on("connection", (socket) => {
  socket.on("hello", (arg) => {
    console.log(arg, socket.id);
  });


  
});