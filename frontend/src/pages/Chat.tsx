import { AppLayout } from "@/components/layout/AppLayout";
import { ChatBubble } from "@/components/ChatBubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Send, Loader2, MessageSquareOff } from "lucide-react";
import { VoiceNotePlayer, VoiceNoteRecorder } from "@/components/VoiceNote";
import { ReactionPicker } from "@/components/ReactionPicker";
import { useSocket } from "@/contexts/SocketContext"; 
import { Link } from "react-router-dom";

const Chat = () => {
  const socket = useSocket();
  const [activeIdx, setActiveIdx] = useState(0);
  const [inputText, setInputText] = useState("");
  const [messageReactions, setMessageReactions] = useState<Record<string, Record<string, number>>>({});
  
  // 1. Initialize with an empty array and loading state
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem("soundmatch_user_id") || "101";
  const isLoggedIn = Boolean(currentUserId);
  const activeUserId = conversations[activeIdx]?.user?.id;

  // 2. Fetch Real Matches for the Sidebar
  useEffect(() => {
    const fetchSidebarMatches = async () => {
      if (!isLoggedIn) return;
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/my-matches/${currentUserId}`);
        if (!res.ok) throw new Error("Failed to fetch matches");
        
        const data = await res.json();
        
        if (data.matches && data.matches.length > 0) {
          const realConversations = data.matches.map((dbUser: any) => ({
            user: {
              id: dbUser.id,
              name: dbUser.username,
              avatar: dbUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.username}`
            },
            messages: [] 
          }));
          setConversations(realConversations);
        }
      } catch (err) {
        console.error("Error fetching sidebar matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarMatches();
  }, [currentUserId, isLoggedIn]);

  // 3. Fetch Chat History when a profile is clicked
  useEffect(() => {
    const fetchHistory = async () => {
      if (!activeUserId || !isLoggedIn) return;

      try {
        const res = await fetch(`http://127.0.0.1:5000/api/messages/${currentUserId}/${activeUserId}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        
        const history = await res.json();
        
        const formattedMessages = history.map((msg: any) => ({
          sender: msg.sender_id === currentUserId ? "You" : conversations[activeIdx].user.name,
          message: msg.content,
          isSelf: msg.sender_id === currentUserId,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isVoiceNote: false, 
          reactions: {}
        }));

        setConversations((prev) => {
          const updated = [...prev];
          if (updated[activeIdx]) {
            updated[activeIdx].messages = formattedMessages;
          }
          return updated;
        });

      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    if (conversations.length > 0) {
      fetchHistory();
    }
  }, [activeIdx, activeUserId, currentUserId, isLoggedIn]);

  // 4. Listen for Real-Time Incoming Message
  useEffect(() => {
    if (!socket || !isLoggedIn) return;

    const handleReceive = (data: any) => {
      setConversations((prev) => {
        const newConversations = [...prev];
        if (newConversations[activeIdx]) {
          newConversations[activeIdx].messages.push({
            sender: data.senderName || "Friend",
            message: data.content,
            isSelf: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: {}
          });
        }
        return newConversations;
      });
    };

    socket.on("receive_private_message", handleReceive);
    return () => { socket.off("receive_private_message", handleReceive); };
  }, [socket, activeIdx, isLoggedIn]);

  // 5. Send Message to Socket & Database
  const handleSendMessage = () => {
    if (!inputText.trim() || conversations.length === 0) return;

    const active = conversations[activeIdx];
    const newMessage = {
      sender: "You",
      message: inputText,
      isSelf: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {}
    };

    // Optimistic UI Update
    const updated = [...conversations];
    updated[activeIdx].messages.push(newMessage);
    setConversations(updated);

    // Emit to Backend
    if (socket && isLoggedIn) {
      socket.emit("send_private_message", {
        senderId: currentUserId,
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

  // --- SAFETY GUARDS ---
  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col h-[calc(100vh-5rem)] items-center justify-center space-y-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading your conversations...</p>
        </div>
      </AppLayout>
    );
  }

  if (conversations.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <MessageSquareOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">No Matches Yet</h2>
          <p className="text-muted-foreground max-w-sm">
            Swipe right on the Discover feed and get a mutual match to start chatting!
          </p>
          <Link to="/discover">
            <Button>Find Matches</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const active = conversations[activeIdx];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-5rem)]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Chat</h1>
          {!isLoggedIn && (
            <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 rounded-full font-medium">
              Demo Mode (Mock Data)
            </span>
          )}
        </div>

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
                  <AvatarImage src={conv.user.avatar} alt={conv.user.name} className="object-cover" />
                  <AvatarFallback>{conv.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{conv.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.messages[conv.messages.length - 1]?.isVoiceNote
                      ? "🎤 Voice note"
                      : conv.messages[conv.messages.length - 1]?.message || "Start chatting"}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col bg-card rounded-lg border border-border/50 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-muted/20">
              <Avatar className="h-8 w-8">
                <AvatarImage src={active.user.avatar} alt={active.user.name} className="object-cover" />
                <AvatarFallback>{active.user.name[0]}</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-foreground">{active.user.name}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {active.messages.map((m: any, i: number) => {
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

            <div className="p-4 border-t border-border/50 flex gap-2 items-center bg-muted/10">
              <VoiceNoteRecorder />
              <Input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={isLoggedIn ? "Type a message..." : "Log in to chat..."} 
                disabled={!isLoggedIn}
                className="bg-background/50 border-border focus-visible:ring-primary" 
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!isLoggedIn}>
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