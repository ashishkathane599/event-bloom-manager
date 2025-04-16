
import React from "react";
import { Link } from "react-router-dom";
import { Event } from "@/lib/models/eventModel";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
  const formattedDate = format(new Date(event.date), 'MMMM dd, yyyy');
  
  return (
    <Link to={`/event/${event.id}`} className="block">
      <div className={cn(
        "rounded-lg overflow-hidden border border-border bg-card card-hover", 
        className
      )}>
        <div className="relative h-48 overflow-hidden">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
          <p className="text-sm text-card-foreground line-clamp-2 mb-3">{event.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {event.participants.length} / {event.capacity} attendees
            </span>
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Details
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
