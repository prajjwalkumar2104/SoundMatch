import { useState } from "react";
import { mockEvents } from "@/data/mockEvents";
import { mockUsers } from "@/data/mockUsers";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Map, List } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";
import { EventMap } from "@/components/EventMap";
import { ConcertBuddyFinder } from "@/components/ConcertBuddyFinder";

const Events = () => {
  const { mode } = useMode();
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Upcoming Events</h1>
            <p className="text-muted-foreground">
              {mode === "friends" ? "See who from your circle is going" : "Find your concert date"}
            </p>
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button size="sm" variant={view === "list" ? "default" : "ghost"} className="h-8 gap-1.5" onClick={() => setView("list")}>
              <List className="h-3.5 w-3.5" /> List
            </Button>
            <Button size="sm" variant={view === "map" ? "default" : "ghost"} className="h-8 gap-1.5" onClick={() => setView("map")}>
              <Map className="h-3.5 w-3.5" /> Map
            </Button>
          </div>
        </div>

        {view === "map" ? (
          <div className="grid gap-4 md:grid-cols-[1fr_280px]">
            <EventMap />
            <ConcertBuddyFinder event={selectedEvent} />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-[1fr_280px]">
            <div className="space-y-4">
              {mockEvents.map((event) => {
                const attendeeUsers = event.attendees.map((id) => mockUsers.find((u) => u.id === id)).filter(Boolean);
                const isSelected = selectedEvent.id === event.id;
                return (
                  <Card
                    key={event.id}
                    className={`overflow-hidden border-border/50 hover:border-primary/30 cursor-pointer transition-all ${isSelected ? "ring-1 ring-primary/40" : ""}`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <img src={event.image} alt={event.name} className="sm:w-48 h-40 sm:h-auto object-cover" />
                      <CardContent className="p-5 flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{event.name}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5" /> {event.venue}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                          <CalendarDays className="h-3.5 w-3.5" /> {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </div>
                        <div className="mt-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            {mode === "friends" ? "Friends going" : "Matches going"}
                          </p>
                          <div className="flex -space-x-2">
                            {attendeeUsers.map((u) => u && (
                              <Avatar key={u.id} className="h-8 w-8 border-2 border-card">
                                <AvatarImage src={u.avatar} alt={u.name} />
                                <AvatarFallback className="text-xs">{u.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
            <ConcertBuddyFinder event={selectedEvent} />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Events;
