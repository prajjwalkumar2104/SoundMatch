interface ChatBubbleProps {
  message: string;
  sender: string;
  isSelf: boolean;
  time: string;
}

export const ChatBubble = ({ message, sender, isSelf, time }: ChatBubbleProps) => {
  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isSelf
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        }`}
      >
        {!isSelf && <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">{sender}</p>}
        <p className="text-sm">{message}</p>
        <p className={`text-[10px] mt-1 ${isSelf ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{time}</p>
      </div>
    </div>
  );
};
