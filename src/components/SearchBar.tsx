import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useUIStore } from '../store/ui';
import { forwardRef } from 'react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ placeholder = 'Search interviews...', className }, ref) => {
    const { searchTerm, setSearchTerm } = useUIStore();

    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';