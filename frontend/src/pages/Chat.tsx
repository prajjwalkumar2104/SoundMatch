import { AppLayout } from "@/components/layout/AppLayout";
import { ChatBubble } from "@/components/ChatBubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/data/mockUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react"; // Added useEffect
import { Send } from "lucide-react";
import { VoiceNotePlayer, VoiceNoteRecorder } from "@/components/VoiceNote";
import { ReactionPicker } from "@/components/ReactionPicker";
import { useSocket } from "@/contexts/SocketContext"; // Added

// We keep your mock data as the initial state
const initialConversations = [
  {
    user: mockUsers[0],
    messages: [
      { sender: "Aria Chen", message: "Hey! Love your taste in music 🎶", isSelf: false, time: "1:20 PM", reactions: { "🔥": 1 } as Record<string, number> },
      { sender: "You", message: "Thanks! Beach House is literally top tier", isSelf: true, time: "1:22 PM", reactions: {} as Record<string, number> },
      { sender: "Aria Chen", message: "We should listen together sometime!", isSelf: false, time: "1:23 PM", reactions: { "❤️": 2, "🎸": 1 } as Record<string, number> },
      { sender: "Aria Chen", message: "", isSelf: false, time: "1:25 PM", isVoiceNote: true, voiceDuration: "0:08", reactions: {} as Record<string, number> },
    ],
  },
  {
    user: mockUsers[2],
    messages: [
      { sender: "Luna Park", message: "Your jazz playlist is so good", isSelf: false, time: "11:05 AM", reactions: {} as Record<string, number> },
      { sender: "You", message: "I'll share the full thing with you!", isSelf: true, time: "11:10 AM", reactions: { "🎹": 1 } as Record<string, number> },
      { sender: "You", message: "", isSelf: true, time: "11:12 AM", isVoiceNote: true, voiceDuration: "0:15", reactions: {} as Record<string, number> },
    ],
  },
];

const Chat = () => {
  const socket = useSocket();
  const [activeIdx, setActiveIdx] = useState(0);
  const [inputText, setInputText] = useState("");
  const [conversations, setConversations] = useState(initialConversations);
  const [messageReactions, setMessageReactions] = useState<Record<string, Record<string, number>>>({});

  // Mock Login Check (Replace with your logic later)
  const isLoggedIn = true; 

  const active = conversations[activeIdx];

  // Logic to handle incoming real-time messages
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_private_message", (data) => {
      setConversations((prev) => {
        const newConversations = [...prev];
        // In a real app, you'd find the conversation by senderId
        // For now, we'll just push it to the active one for testing
        newConversations[activeIdx].messages.push({
          sender: data.senderName || "Friend",
          message: data.content,
          isSelf: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: {}
        });
        return [...newConversations];
      });
    });

    return () => { socket.off("receive_private_message"); };
  }, [socket, activeIdx]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      sender: "You",
      message: inputText,
      isSelf: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {}
    };

    // 1. Update UI immediately
    const updated = [...conversations];
    updated[activeIdx].messages.push(newMessage);
    setConversations(updated);

    // 2. Send to Backend
    if (socket && isLoggedIn) {
      socket.emit("send_private_message", {
        recipientId: active.user.id,
        content: inputText
      });
    }

    setInputText("");
  };

  const handleReact = (msgKey: string, emoji: string) => {
    setMessageReactions((prev) => {
      const msgR = { ...(prev[msgKey] || {}) };
      msgR[emoji] = (msgR[emoji] || 0) + 1;
      return { ...prev, [msgKey]: msgR };
    });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-5rem)]">
        <h1 className="text-3xl font-bold text-foreground mb-6">Chat</h1>

        <div className="flex gap-4 h-[calc(100%-4rem)]">
          {/* Sidebar */}
          <div className="w-64 shrink-0 space-y-1 overflow-y-auto">
            {conversations.map((conv, idx) => (
              <button
                key={conv.user.id}
                onClick={() => setActiveIdx(idx)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  idx === activeIdx ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conv.user.avatar} alt={conv.user.name} />
                  <AvatarFallback>{conv.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{conv.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.messages[conv.messages.length - 1]?.isVoiceNote
                      ? "🎤 Voice note"
                      : conv.messages[conv.messages.length - 1]?.message}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col bg-card rounded-lg border border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={active.user.avatar} alt={active.user.name} />
                <AvatarFallback>{active.user.name[0]}</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-foreground">{active.user.name}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {active.messages.map((m, i) => {
                const key = `${activeIdx}-${i}`;
                const mergedReactions = {
                  ...m.reactions,
                  ...(messageReactions[key] || {}),
                };
                return (
                  <div key={i}>
                    {m.isVoiceNote ? (
                      <div className={`flex ${m.isSelf ? "justify-end" : "justify-start"} mb-3`}>
                        <div
                          className={`rounded-2xl px-4 py-2.5 ${
                            m.isSelf
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          {!m.isSelf && (
                            <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                              {m.sender}
                            </p>
                          )}
                          <VoiceNotePlayer duration={m.voiceDuration} />
                          <p className={`text-[10px] mt-1 ${m.isSelf ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                            {m.time}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <ChatBubble {...m} />
                    )}
                    <div className={`flex ${m.isSelf ? "justify-end" : "justify-start"} -mt-1 mb-2`}>
                      <ReactionPicker
                        reactions={mergedReactions}
                        onReact={(emoji) => handleReact(key, emoji)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-border/50 flex gap-2 items-center">
              <VoiceNoteRecorder />
              <Input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..." 
                className="bg-muted border-border" 
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;