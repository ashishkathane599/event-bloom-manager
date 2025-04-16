
import React from "react";
import { Participant } from "@/lib/models/participantModel";
import { cn } from "@/lib/utils";

interface ParticipantCardProps {
  participant: Participant;
  className?: string;
  onRemove?: (id: string) => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ 
  participant, 
  className,
  onRemove
}) => {
  return (
    <div className={cn(
      "rounded-lg border border-border bg-card p-4", 
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-medium text-primary">
              {participant.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{participant.name}</h3>
            <p className="text-sm text-muted-foreground">{participant.email}</p>
          </div>
        </div>
        {onRemove && (
          <button 
            onClick={() => onRemove(participant.id)}
            className="text-sm text-destructive hover:underline"
          >
            Remove
          </button>
        )}
      </div>
      
      <div className="mt-3">
        <p className="text-xs text-muted-foreground mb-1">
          Registered for {participant.registeredEvents.length} events
        </p>
      </div>
    </div>
  );
};

export default ParticipantCard;
