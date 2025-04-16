
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="font-bold text-lg text-white">EB</span>
          </div>
          <span className="font-bold text-xl">EventBloom</span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/") ? "text-primary" : "text-foreground/60"
            )}
          >
            Events
          </Link>
          <Link 
            to="/register" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/register") ? "text-primary" : "text-foreground/60"
            )}
          >
            Register
          </Link>
          <Link 
            to="/participants" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/participants") ? "text-primary" : "text-foreground/60"
            )}
          >
            Participants
          </Link>
          <Link 
            to="/venues" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/venues") ? "text-primary" : "text-foreground/60"
            )}
          >
            Venues
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
