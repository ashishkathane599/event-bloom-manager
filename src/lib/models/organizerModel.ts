
// Organizer model
export interface Organizer {
  id: string;
  name: string;
  email: string;
  managedEvents: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for Organizer
export const mockOrganizers: Organizer[] = [
  {
    id: "org-001",
    name: "TechEvents Inc",
    email: "contact@techevents.com",
    managedEvents: ["evt-001", "evt-003"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "org-002",
    name: "WebDev Academy",
    email: "info@webdevacademy.com",
    managedEvents: ["evt-002"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "org-003",
    name: "Startup Hub",
    email: "connect@startuphub.com",
    managedEvents: ["evt-004"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
