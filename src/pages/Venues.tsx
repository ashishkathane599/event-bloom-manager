
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Venue, TimeSlot } from "@/lib/models/venueModel";
import { Event } from "@/lib/models/eventModel";
import LoadingSpinner from "@/components/LoadingSpinner";
import NavBar from "@/components/ui/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";

const Venues: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch venues and events in parallel
        const [venuesData, eventsData] = await Promise.all([
          api.getVenues(),
          api.getEvents()
        ]);
        
        setVenues(venuesData);
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load venues data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignVenue = async () => {
    if (!selectedVenue || !selectedEvent) {
      toast({
        title: "Missing information",
        description: "Please select both a venue and an event.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Assign venue to event
      await api.assignVenueToEvent(selectedEvent, selectedVenue);
      
      toast({
        title: "Venue assigned",
        description: "The venue has been successfully assigned to the event.",
      });
      
      // Reset form
      setSelectedVenue("");
      setSelectedEvent("");
      setSelectedTimeSlot("");
      
      // Refresh events data
      const updatedEvents = await api.getEvents();
      setEvents(updatedEvents);
      
    } catch (err) {
      console.error("Error assigning venue:", err);
      toast({
        title: "Assignment failed",
        description: "There was an error assigning the venue to the event.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVenueById = (id: string) => {
    return venues.find(venue => venue.id === id);
  };

  const getAvailableSlots = (venue: Venue) => {
    return venue.availableSlots.filter(slot => !slot.isBooked);
  };

  // Group time slots by date
  const groupSlotsByDate = (slots: TimeSlot[]) => {
    const grouped: Record<string, TimeSlot[]> = {};
    
    slots.forEach(slot => {
      const dateStr = format(new Date(slot.date), 'yyyy-MM-dd');
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(slot);
    });
    
    return grouped;
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
      
      <main className="container py-8 px-4 md:px-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-3">Venues</h1>
          <p className="text-muted-foreground">
            View venue details and assign venues to events.
          </p>
        </div>
        
        {error ? (
          <div className="text-center p-8 text-destructive">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Venue List */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="list">Venue List</TabsTrigger>
                  <TabsTrigger value="events">Events by Venue</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list" className="space-y-6">
                  {venues.map(venue => (
                    <Card key={venue.id}>
                      <CardHeader>
                        <CardTitle>{venue.name}</CardTitle>
                        <CardDescription>{venue.address}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Capacity</p>
                            <p className="text-muted-foreground">{venue.capacity} people</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Available Slots</p>
                            <p className="text-muted-foreground">
                              {getAvailableSlots(venue).length} slots available
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="events">
                  {venues.map(venue => {
                    const venueEvents = events.filter(event => event.venue === venue.id);
                    
                    return (
                      <Card key={venue.id} className="mb-6">
                        <CardHeader>
                          <CardTitle>{venue.name}</CardTitle>
                          <CardDescription>{venue.address}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {venueEvents.length > 0 ? (
                            <div className="space-y-4">
                              {venueEvents.map(event => (
                                <div key={event.id} className="bg-secondary/50 p-3 rounded-md">
                                  <p className="font-medium">{event.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(event.date), 'MMMM dd, yyyy')}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No events assigned to this venue.</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Assign Venue Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Assign Venue</CardTitle>
                  <CardDescription>
                    Assign a venue to an upcoming event.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Event</label>
                    <Select
                      value={selectedEvent}
                      onValueChange={setSelectedEvent}
                    >
                      <SelectTrigger>
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
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Venue</label>
                    <Select
                      value={selectedVenue}
                      onValueChange={setSelectedVenue}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a venue" />
                      </SelectTrigger>
                      <SelectContent>
                        {venues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.name} ({venue.capacity} capacity)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedVenue && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Available Time Slots</label>
                        <Badge variant="outline" className="text-xs">
                          {getAvailableSlots(getVenueById(selectedVenue)!).length} Available
                        </Badge>
                      </div>
                      
                      <div className="h-48 overflow-y-auto pr-2 space-y-3">
                        {Object.entries(groupSlotsByDate(getAvailableSlots(getVenueById(selectedVenue)!))).map(([date, slots]) => (
                          <div key={date} className="space-y-1">
                            <p className="text-xs font-medium">
                              {format(parseISO(date), 'MMMM dd, yyyy')}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {slots.map((slot, index) => (
                                <button
                                  key={index}
                                  className={`text-xs py-1 px-2 rounded-md transition-colors ${
                                    selectedTimeSlot === `${date}-${slot.startTime}` 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'bg-secondary hover:bg-secondary/70'
                                  }`}
                                  onClick={() => setSelectedTimeSlot(`${date}-${slot.startTime}`)}
                                >
                                  {slot.startTime}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleAssignVenue} 
                    className="w-full"
                    disabled={!selectedVenue || !selectedEvent || isSubmitting}
                  >
                    {isSubmitting ? 'Assigning...' : 'Assign Venue'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Venues;
