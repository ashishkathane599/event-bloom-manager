
// Participant model
export interface Participant {
  id: string;
  name: string;
  email: string;
  registeredEvents: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for Participant
export const mockParticipants: Participant[] = [
  {
    id: "part-001",
    name: "John Doe",
    email: "john.doe@example.com",
    registeredEvents: ["evt-001", "evt-004"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "part-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    registeredEvents: ["evt-001"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "part-003",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    registeredEvents: ["evt-002"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "part-004",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    registeredEvents: ["evt-004"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
