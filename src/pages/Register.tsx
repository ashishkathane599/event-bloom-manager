
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Event } from "@/lib/models/eventModel";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import NavBar from "@/components/ui/navbar";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await api.getEvents();
        // Only include events that have available capacity
        const availableEvents = data.filter(event => 
          event.participants.length < event.capacity
        );
        setEvents(availableEvents);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !selectedEventId) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create new participant
      const newParticipant = await api.createParticipant({
        name,
        email,
        registeredEvents: [selectedEventId]
      });
      
      // Register participant for the event
      await api.registerForEvent(selectedEventId, newParticipant.id);
      
      toast({
        title: "Registration successful",
        description: "You have been registered for the event.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSelectedEventId("");
      
      // Redirect to event details page
      navigate(`/event/${selectedEventId}`);
      
    } catch (err) {
      console.error("Error registering for event:", err);
      toast({
        title: "Registration failed",
        description: "There was an error registering for the event.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container py-12 px-4 md:px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Register for an Event</h1>
            <p className="text-muted-foreground">
              Fill out the form below to register for one of our upcoming events.
            </p>
          </div>
          
          {error ? (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>
                  {error}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => navigate("/")}>
                  Return to Events
                </Button>
              </CardFooter>
            </Card>
          ) : events.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Available Events</CardTitle>
                <CardDescription>
                  There are currently no events with available spots.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => navigate("/")}>
                  View All Events
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Participant Information</CardTitle>
                <CardDescription>
                  Please enter your details and select an event.
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event">Select Event</Label>
                    <Select
                      value={selectedEventId}
                      onValueChange={setSelectedEventId}
                    >
                      <SelectTrigger id="event">
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Register Now'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Register;
