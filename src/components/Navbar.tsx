import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useThemeStore } from '../store/theme';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-sm flex items-center justify-center" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="24" height="24" fill="#FF7A00" rx="2" ry="2" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-brand bg-clip-text text-transparent">
            Nexa Interviews
          </span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            to="/app"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname.startsWith('/app') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Dashboard
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-8 w-8 p-0"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
};