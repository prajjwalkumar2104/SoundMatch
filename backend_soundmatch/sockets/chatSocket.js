const supabase = require('../config/supabase'); 

module.exports = (io) => {
  io.on('connection', (socket) => {

    console.log('A user connected:', socket.id);

    // --- REAL-TIME PERSISTENT PRIVATE MESSAGE ---
    socket.on('send_private_message', async (data) => {
      // We now expect the frontend to pass the senderId as well
      const { senderId, recipientId, content } = data; 

      try {
        // 1. Save the message permanently to Supabase
        const { data: savedMessage, error } = await supabase
          .from('messages')
          .insert([{ 
            sender_id: senderId, 
            recipient_id: recipientId, 
            content: content 
          }])
          .select().single();

        if (error) throw error;

        // 2. Broadcast the message to the recipient
        // Note: socket.broadcast.emit sends it to everyone for testing. 
        // For production, you'd use io.to(recipientId).emit()
        socket.broadcast.emit('receive_private_message', {
          senderName: "Friend", // You can join the profiles table to get the real name later
          content: content,
          timestamp: savedMessage.created_at
        });

        console.log(`Message saved & sent to ${recipientId}`);
      } catch (err) {
        console.error("Failed to save message to database:", err.message);
      }
    });
    
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
    socket.on('sync_track', (data) => {
      const { loungeId, trackUri, trackName } = data;
      // Broadcast to everyone ELSE in that specific lounge
      socket.to(`lounge_${loungeId}`).emit('track_changed', {
        uri: trackUri,
        name: trackName
      });
    });
  });
};