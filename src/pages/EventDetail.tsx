
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { api } from "@/lib/api";
import { Event } from "@/lib/models/eventModel";
import { Venue } from "@/lib/models/venueModel";
import { Organizer } from "@/lib/models/organizerModel";
import { Participant } from "@/lib/models/participantModel";
import ParticipantCard from "@/components/ParticipantCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import NavBar from "@/components/ui/navbar";

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch event details
        const eventData = await api.getEvent(id);
        if (!eventData) {
          setError("Event not found");
          return;
        }
        setEvent(eventData);
        
        // Fetch venue details
        if (eventData.venue) {
          const venueData = await api.getVenue(eventData.venue);
          setVenue(venueData || null);
        }
        
        // Fetch organizer details
        if (eventData.organizer) {
          const organizerData = await api.getOrganizer(eventData.organizer);
          setOrganizer(organizerData || null);
        }
        
        // Fetch participants
        const allParticipants = await api.getParticipants();
        const eventParticipants = allParticipants.filter(p => 
          eventData.participants.includes(p.id)
        );
        setParticipants(eventParticipants);
        
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRegister = async () => {
    if (!event) return;
    
    // In a real app, you would collect user information here
    // For now, we'll just simulate registration with a mock participant
    try {
      const newParticipant = await api.createParticipant({
        name: "Guest User",
        email: `guest${Date.now()}@example.com`,
        registeredEvents: [event.id]
      });
      
      await api.registerForEvent(event.id, newParticipant.id);
      
      toast({
        title: "Registration successful",
        description: "You have been registered for this event.",
      });
      
      // Refresh event data
      const updatedEvent = await api.getEvent(event.id);
      if (updatedEvent) setEvent(updatedEvent);
      
      // Add new participant to the list
      setParticipants([...participants, newParticipant]);
      
    } catch (err) {
      console.error("Error registering for event:", err);
      toast({
        title: "Registration failed",
        description: "There was an error registering for this event.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    if (!event) return;
    
    try {
      await api.unregisterFromEvent(event.id, participantId);
      
      toast({
        title: "Participant removed",
        description: "The participant has been removed from this event.",
      });
      
      // Refresh event data
      const updatedEvent = await api.getEvent(event.id);
      if (updatedEvent) setEvent(updatedEvent);
      
      // Remove participant from the list
      setParticipants(participants.filter(p => p.id !== participantId));
      
    } catch (err) {
      console.error("Error removing participant:", err);
      toast({
        title: "Failed to remove participant",
        description: "There was an error removing the participant.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">{error || "Event not found"}</h1>
          <Button onClick={() => navigate("/")}>Return to Events</Button>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(event.date), 'MMMM dd, yyyy');
  const availableSpots = event.capacity - event.participants.length;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="w-full h-64 md:h-96 relative">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-xl">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      
      <main className="container py-8 px-4 md:px-6 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formattedDate}</span>
                </div>
                {venue && (
                  <div className="flex items-center text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{venue.name}</span>
                  </div>
                )}
                <div className="flex items-center text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{event.participants.length} attendees</span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-3">About This Event</h2>
              <p className="text-card-foreground mb-6">{event.description}</p>
              
              {organizer && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Organizer</h2>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <h3 className="font-medium">{organizer.name}</h3>
                    <p className="text-sm text-muted-foreground">{organizer.email}</p>
                  </div>
                </div>
              )}
              
              {venue && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Venue</h2>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <h3 className="font-medium">{venue.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{venue.address}</p>
                    <p className="text-sm text-muted-foreground">Capacity: {venue.capacity}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Participants Section */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Participants</h2>
                <span className="text-sm text-muted-foreground">
                  {event.participants.length} / {event.capacity}
                </span>
              </div>
              
              {participants.length > 0 ? (
                <div className="space-y-3">
                  {participants.map(participant => (
                    <ParticipantCard 
                      key={participant.id} 
                      participant={participant}
                      onRemove={handleRemoveParticipant}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No participants have registered yet.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Registration Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Event Registration</h2>
              
              <div className="flex justify-between mb-2">
                <span>Date</span>
                <span className="font-medium">{formattedDate}</span>
              </div>
              
              {venue && (
                <div className="flex justify-between mb-2">
                  <span>Location</span>
                  <span className="font-medium">{venue.name}</span>
                </div>
              )}
              
              <div className="flex justify-between mb-6">
                <span>Available spots</span>
                <span className={`font-medium ${availableSpots === 0 ? 'text-destructive' : 'text-primary'}`}>
                  {availableSpots}
                </span>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleRegister}
                disabled={availableSpots === 0}
              >
                {availableSpots === 0 ? 'Event Full' : 'Register Now'}
              </Button>
              
              {availableSpots === 0 && (
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  This event is at full capacity. Please check back later or explore other events.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
