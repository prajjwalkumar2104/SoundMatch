const supabase = require('../config/supabase'); 

module.exports = (io) => {
  io.on('connection', (socket) => {
    
    // Join a specific lounge room
    socket.on('join_lounge', (loungeId) => {
      socket.join(`lounge_${loungeId}`);
      console.log(`Socket ${socket.id} joined lounge_${loungeId}`);
    });

    // Handle incoming lounge messages
    socket.on('send_lounge_message', async (data) => {
  const { loungeId, senderId, senderName, content } = data;

  const { data: savedMsg, error } = await supabase
    .from('lounge_messages') // <-- CHANGE THIS FROM 'messages'
    .insert([{ lounge_id: loungeId, sender_id: senderId, content }])
    .select()
    .single();

  if (error) {
    console.error("Message save error:", error.message);
    return;
  }

      // 2. Broadcast to everyone in that specific lounge
      io.to(`lounge_${loungeId}`).emit('receive_lounge_message', {
        id: savedMsg.id,
        sender: senderName,
        message: content,
        // The frontend will determine isSelf based on the sender's ID
        senderId: senderId, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    });
  });
};