const path = require('path');
const express = require('express');


const socket = require('socket.io');
const app = express();
const port = process.env.PORT || 3000


// settings
app.set('port', port);
app.use(express.static(path.join(__dirname, 'public')));


// Server selection
const server = app.listen(port, () => {
  console.log('Listening on port', port);
});


// Socket management
const io = socket(server);
io.on('connection', (socket) => {
  console.log('socket connection opened:', socket.id);
});