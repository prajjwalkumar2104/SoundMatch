// sockets/chatSocket.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // --- EXISTING LOUNGE LOGIC ---
    socket.on('join_lounge', (loungeId) => {
      socket.join(`lounge_${loungeId}`);
    });

    socket.on('send_lounge_message', (data) => {
      const { loungeId, senderId, content } = data;
      io.to(`lounge_${loungeId}`).emit('receive_lounge_message', {
        senderId,
        content,
        timestamp: new Date()
      });
    });

    // --- NEW PRIVATE MESSAGE LOGIC (Fix is here!) ---
    socket.on('send_private_message', async (data) => {
      const { recipientId, content } = data;
      
      // For now, we broadcast to everyone just to test the connection.
      // Later, we will use socket.to(recipientId) for true 1-on-1.
      socket.broadcast.emit('receive_private_message', {
        senderName: "Friend", // We'll pull this from Supabase later
        content: content,
        timestamp: new Date()
      });
      
      console.log(`Message sent to ${recipientId}: ${content}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};


module.exports = (io) => {
  io.on('connection', (socket) => {
    // This logs every time someone opens the app (if the frontend is connected)
    console.log('New connection detected:', socket.id);

    socket.emit('welcome', { message: 'Connected to SoundMatch Real-time!' });
  });
};