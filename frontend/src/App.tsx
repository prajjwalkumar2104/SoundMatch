import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModeProvider } from "@/contexts/ModeContext";
import Landing from "./pages/Landing.tsx";
import Index from "./pages/Index.tsx";
import Profile from "./pages/Profile.tsx";
import MyProfile from "./pages/MyProfile.tsx";
import Matches from "./pages/Matches.tsx";
import MusicLounge from "./pages/MusicLounge.tsx";
import Events from "./pages/Events.tsx";
import Chat from "./pages/Chat.tsx";
import GroupLounges from "./pages/GroupLounges.tsx";
import ActivityFeed from "./pages/ActivityFeed.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import ListeningStats from "./pages/ListeningStats.tsx";
import WeeklyReport from "./pages/WeeklyReport.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ModeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/discover" element={<Index />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/me" element={<MyProfile />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/lounge" element={<MusicLounge />} />
            <Route path="/events" element={<Events />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/group-lounges" element={<GroupLounges />} />
            <Route path="/feed" element={<ActivityFeed />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/stats" element={<ListeningStats />} />
            <Route path="/weekly-report" element={<WeeklyReport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
