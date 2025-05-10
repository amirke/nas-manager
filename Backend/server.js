// Backend/server.js (ESM)
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import os from 'os';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

app.use(cors()); // ✅ Allow all origins for development

// LAN IP detection
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address;
      }
    }
  }
  return 'localhost';
};

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
 // setInterval(() => {
	// Sends the message only to that specific client (the one who just connected)    
	socket.emit('log', `🕒 ${new Date().toLocaleTimeString()}`); 
//  }, 5000);
});

app.get('/', (req, res) => {
  res.send('🟢 Socket.IO server running!');
});

//		// Test:
//		setInterval(() => {
//		
//		// Sends the message to all connected clients
//		// Used for broadcasting (e.g. logs, chat messages)	
//		  io.emit('log', 'Hello from server at ' + new Date().toLocaleTimeString());
//		}, 5000);


server.listen(3001, '0.0.0.0', () => {
  console.log(`🟢 Server listening on http://${getLocalIP()}:3001`);
});
