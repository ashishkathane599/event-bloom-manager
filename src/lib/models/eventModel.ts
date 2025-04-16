
// Event model
export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  venue: string;
  organizer: string;
  participants: string[];
  image?: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for Event
export const mockEvents: Event[] = [
  {
    id: "evt-001",
    title: "Tech Conference 2023",
    description: "A conference exploring the latest technologies and innovations in the tech industry.",
    date: new Date(2023, 5, 15),
    venue: "ven-001",
    organizer: "org-001",
    participants: ["part-001", "part-002"],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    capacity: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "evt-002",
    title: "Web Development Workshop",
    description: "Hands-on workshop teaching modern web development techniques.",
    date: new Date(2023, 6, 20),
    venue: "ven-002",
    organizer: "org-002",
    participants: ["part-003"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    capacity: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "evt-003",
    title: "AI Summit",
    description: "Exploring the future of artificial intelligence and its implications.",
    date: new Date(2023, 7, 10),
    venue: "ven-001",
    organizer: "org-001",
    participants: [],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
    capacity: 300,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "evt-004",
    title: "Startup Networking Night",
    description: "Connect with founders, investors, and industry experts.",
    date: new Date(2023, 8, 5),
    venue: "ven-003",
    organizer: "org-003",
    participants: ["part-001", "part-004"],
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop",
    capacity: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
