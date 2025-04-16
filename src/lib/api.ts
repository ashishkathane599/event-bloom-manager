
import { Event, mockEvents } from "./models/eventModel";
import { Participant, mockParticipants } from "./models/participantModel";
import { Organizer, mockOrganizers } from "./models/organizerModel";
import { Venue, mockVenues } from "./models/venueModel";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
export const api = {
  // Events
  getEvents: async (): Promise<Event[]> => {
    await delay(500);
    return [...mockEvents];
  },
  
  getEvent: async (id: string): Promise<Event | undefined> => {
    await delay(300);
    return mockEvents.find(event => event.id === id);
  },
  
  createEvent: async (event: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> => {
    await delay(600);
    const newEvent: Event = {
      id: `evt-${mockEvents.length + 1}`.padStart(7, '0'),
      ...event,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockEvents.push(newEvent);
    return newEvent;
  },
  
  updateEvent: async (id: string, event: Partial<Event>): Promise<Event | undefined> => {
    await delay(400);
    const index = mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEvents[index] = {
        ...mockEvents[index],
        ...event,
        updatedAt: new Date()
      };
      return mockEvents[index];
    }
    return undefined;
  },
  
  deleteEvent: async (id: string): Promise<boolean> => {
    await delay(300);
    const index = mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEvents.splice(index, 1);
      return true;
    }
    return false;
  },
  
  // Participants
  getParticipants: async (): Promise<Participant[]> => {
    await delay(400);
    return [...mockParticipants];
  },
  
  getParticipant: async (id: string): Promise<Participant | undefined> => {
    await delay(200);
    return mockParticipants.find(participant => participant.id === id);
  },
  
  createParticipant: async (participant: Omit<Participant, "id" | "createdAt" | "updatedAt">): Promise<Participant> => {
    await delay(500);
    const newParticipant: Participant = {
      id: `part-${mockParticipants.length + 1}`.padStart(7, '0'),
      ...participant,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockParticipants.push(newParticipant);
    return newParticipant;
  },
  
  updateParticipant: async (id: string, participant: Partial<Participant>): Promise<Participant | undefined> => {
    await delay(300);
    const index = mockParticipants.findIndex(p => p.id === id);
    if (index !== -1) {
      mockParticipants[index] = {
        ...mockParticipants[index],
        ...participant,
        updatedAt: new Date()
      };
      return mockParticipants[index];
    }
    return undefined;
  },
  
  registerForEvent: async (eventId: string, participantId: string): Promise<boolean> => {
    await delay(400);
    const event = mockEvents.find(e => e.id === eventId);
    const participant = mockParticipants.find(p => p.id === participantId);
    
    if (event && participant) {
      // Check if participant is already registered
      if (!event.participants.includes(participantId)) {
        event.participants.push(participantId);
      }
      
      // Add event to participant's registered events
      if (!participant.registeredEvents.includes(eventId)) {
        participant.registeredEvents.push(eventId);
      }
      
      return true;
    }
    
    return false;
  },
  
  unregisterFromEvent: async (eventId: string, participantId: string): Promise<boolean> => {
    await delay(300);
    const event = mockEvents.find(e => e.id === eventId);
    const participant = mockParticipants.find(p => p.id === participantId);
    
    if (event && participant) {
      // Remove participant from event
      event.participants = event.participants.filter(id => id !== participantId);
      
      // Remove event from participant's registered events
      participant.registeredEvents = participant.registeredEvents.filter(id => id !== eventId);
      
      return true;
    }
    
    return false;
  },
  
  // Organizers
  getOrganizers: async (): Promise<Organizer[]> => {
    await delay(400);
    return [...mockOrganizers];
  },
  
  getOrganizer: async (id: string): Promise<Organizer | undefined> => {
    await delay(200);
    return mockOrganizers.find(organizer => organizer.id === id);
  },
  
  // Venues
  getVenues: async (): Promise<Venue[]> => {
    await delay(400);
    return [...mockVenues];
  },
  
  getVenue: async (id: string): Promise<Venue | undefined> => {
    await delay(200);
    return mockVenues.find(venue => venue.id === id);
  },
  
  assignVenueToEvent: async (eventId: string, venueId: string): Promise<boolean> => {
    await delay(500);
    const event = mockEvents.find(e => e.id === eventId);
    const venue = mockVenues.find(v => v.id === venueId);
    
    if (event && venue) {
      event.venue = venueId;
      event.updatedAt = new Date();
      return true;
    }
    
    return false;
  }
};
