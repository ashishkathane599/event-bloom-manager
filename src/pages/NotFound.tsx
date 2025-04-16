
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/navbar";

const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container flex flex-col items-center justify-center py-20 px-4 text-center">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
          <br />
          <span className="text-sm">{location.pathname}</span>
        </p>
        <Link to="/">
          <Button size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
