import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { mockUsers } from "@/data/mockUsers";
import { Heart, Music, Users, ListMusic, Headphones, MessageCircle } from "lucide-react";
import { StoriesBar, StoryViewer } from "@/components/MusicStories";
import { useState } from "react";

interface FeedItem {
  id: string;
  type: "match" | "playlist" | "lounge" | "listen" | "story" | "reaction";
  user: (typeof mockUsers)[0];
  targetUser?: (typeof mockUsers)[0];
  content: string;
  detail?: string;
  time: string;
  icon: typeof Heart;
  color: string;
}

const feedItems: FeedItem[] = [
  {
    id: "1",
    type: "match",
    user: mockUsers[0],
    targetUser: mockUsers[2],
    content: "matched with",
    detail: "92% music compatibility",
    time: "2m ago",
    icon: Heart,
    color: "text-pink-500",
  },
  {
    id: "2",
    type: "playlist",
    user: mockUsers[4],
    content: "shared a playlist",
    detail: "Bedroom Pop Essentials · 24 tracks",
    time: "15m ago",
    icon: ListMusic,
    color: "text-emerald-500",
  },
  {
    id: "3",
    type: "lounge",
    user: mockUsers[1],
    content: "created a lounge",
    detail: "Bass Cathedral · EDM / House",
    time: "32m ago",
    icon: Headphones,
    color: "text-cyan-500",
  },
  {
    id: "4",
    type: "listen",
    user: mockUsers[3],
    content: "is listening to",
    detail: "Chamber of Reflection — Mac DeMarco",
    time: "45m ago",
    icon: Music,
    color: "text-violet-500",
  },
  {
    id: "5",
    type: "reaction",
    user: mockUsers[5],
    targetUser: mockUsers[0],
    content: "reacted 🔥 to",
    detail: "Space Song story",
    time: "1h ago",
    icon: MessageCircle,
    color: "text-orange-500",
  },
  {
    id: "6",
    type: "match",
    user: mockUsers[3],
    targetUser: mockUsers[5],
    content: "matched with",
    detail: "71% music compatibility",
    time: "2h ago",
    icon: Heart,
    color: "text-pink-500",
  },
  {
    id: "7",
    type: "lounge",
    user: mockUsers[2],
    content: "joined",
    detail: "Lo-Fi & Chill lounge",
    time: "3h ago",
    icon: Users,
    color: "text-teal-500",
  },
  {
    id: "8",
    type: "playlist",
    user: mockUsers[0],
    content: "shared a playlist",
    detail: "Dreamy Shoegaze Mix · 18 tracks",
    time: "4h ago",
    icon: ListMusic,
    color: "text-emerald-500",
  },
];

const ActivityFeed = () => {
  const [storyIdx, setStoryIdx] = useState<number | null>(null);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Activity Feed</h1>

        {/* Stories */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Music Stories
            </p>
            <StoriesBar onOpen={(i) => setStoryIdx(i)} />
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="space-y-3">
          {feedItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.id} className="border-border/50 hover:border-border transition-colors">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{item.user.name}</span>{" "}
                      {item.content}{" "}
                      {item.targetUser && (
                        <span className="font-semibold">{item.targetUser.name}</span>
                      )}
                    </p>
                    {item.detail && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{item.time}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Story viewer overlay */}
      {storyIdx !== null && (
        <StoryViewer initialIdx={storyIdx} onClose={() => setStoryIdx(null)} />
      )}
    </AppLayout>
  );
};

export default ActivityFeed;
