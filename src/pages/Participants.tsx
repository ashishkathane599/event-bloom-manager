
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Participant } from "@/lib/models/participantModel";
import { Event } from "@/lib/models/eventModel";
import ParticipantCard from "@/components/ParticipantCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/navbar";

const Participants: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "table">("list");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch participants and events in parallel
        const [participantsData, eventsData] = await Promise.all([
          api.getParticipants(),
          api.getEvents()
        ]);
        
        setParticipants(participantsData);
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load participants data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getEventTitles = (eventIds: string[]): string => {
    return eventIds
      .map(id => events.find(event => event.id === id)?.title || "Unknown Event")
      .join(", ");
  };

  const filteredParticipants = participants.filter(participant => 
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container py-8 px-4 md:px-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-3">Participants</h1>
          <p className="text-muted-foreground">
            View and manage all participants registered for events.
          </p>
        </div>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center p-8 text-destructive">
            <p>{error}</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <Input
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  size="sm"
                >
                  List View
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  onClick={() => setViewMode("table")}
                  size="sm"
                >
                  Table View
                </Button>
              </div>
            </div>
            
            {filteredParticipants.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <p className="text-muted-foreground">No participants found.</p>
              </div>
            ) : viewMode === "list" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredParticipants.map(participant => (
                  <ParticipantCard 
                    key={participant.id} 
                    participant={participant}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registered Events</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map(participant => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">{participant.name}</TableCell>
                        <TableCell>{participant.email}</TableCell>
                        <TableCell>
                          {participant.registeredEvents.length > 0 
                            ? getEventTitles(participant.registeredEvents)
                            : "None"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Participants;
