import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';

import cors from 'cors';
import { ALL } from 'dns';
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  connectionStateRecovery: {}
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(ALL))


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

 io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    
    io.emit('chat message', msg);
  });
});



server.listen(3000, () => {
  console.log('listening on *:3000');
} );
