
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Event } from "@/lib/models/eventModel";
import EventCard from "@/components/EventCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import NavBar from "@/components/ui/navbar";

const Index: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await api.getEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      
      <main className="container py-8 px-4 md:px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Event<span className="text-primary">Bloom</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing events, workshops, and conferences all in one place.
          </p>
        </div>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center p-8 text-destructive">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
