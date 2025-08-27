import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-nexa-navy-dark flex items-center justify-center px-4">
      <div className="text-center">
        <AlertTriangle className="h-24 w-24 text-nexa-orange mx-auto mb-8" />
        <h1 className="text-6xl font-bold bg-gradient-brand bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="brand">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};