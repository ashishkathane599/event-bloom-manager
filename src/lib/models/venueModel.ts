
// Venue model
export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  availableSlots: TimeSlot[];
  createdAt: Date;
  updatedAt: Date;
}

// TimeSlot type for venues
export interface TimeSlot {
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

// Helper function to create time slots
const createTimeSlots = (date: Date, isBooked = false) => {
  const slots = [];
  // Create slots from 9 AM to 5 PM
  for (let hour = 9; hour < 17; hour++) {
    slots.push({
      date: new Date(date),
      startTime: `${hour}:00`,
      endTime: `${hour + 1}:00`,
      isBooked
    });
  }
  return slots;
};

// Create dates for the next 7 days
const getNextWeekDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

// Generate time slots for the next week
const generateNextWeekSlots = () => {
  const dates = getNextWeekDates();
  let allSlots: TimeSlot[] = [];
  
  dates.forEach(date => {
    allSlots = [...allSlots, ...createTimeSlots(date)];
  });
  
  return allSlots;
};

// Mock data for Venue
export const mockVenues: Venue[] = [
  {
    id: "ven-001",
    name: "Grand Conference Center",
    address: "123 Main St, City Center",
    capacity: 500,
    availableSlots: generateNextWeekSlots(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "ven-002",
    name: "Tech Hub",
    address: "456 Innovation Ave, Tech District",
    capacity: 150,
    availableSlots: generateNextWeekSlots(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "ven-003",
    name: "Startup Space",
    address: "789 Entrepreneur Blvd, Business Park",
    capacity: 100,
    availableSlots: generateNextWeekSlots(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
