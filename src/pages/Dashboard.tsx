import { useState, useRef } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { UploadArea } from '../components/UploadArea';
import { SearchBar } from '../components/SearchBar';
import { InterviewCard } from '../components/InterviewCard';
import { useInterviews } from '../hooks/useInterviews';
import { useUIStore } from '../store/ui';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Interview } from '../types/interview';
import { Skeleton } from '../components/ui/skeleton';

export const Dashboard = () => {
  const [showUpload, setShowUpload] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: interviews, isLoading, error } = useInterviews();
  const { searchTerm } = useUIStore();

  useKeyboardShortcuts({ searchInputRef });

  const filteredInterviews = interviews?.filter((interview: Interview) =>
    interview.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.filename.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    total: interviews?.length || 0,
    completed: interviews?.filter(i => i.status === 'completed').length || 0,
    processing: interviews?.filter(i => i.status === 'processing').length || 0,
    failed: interviews?.filter(i => i.status === 'failed').length || 0,
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-brand bg-clip-text text-transparent mb-2">
            Interview Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and analyze your interview recordings
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            onClick={() => setShowUpload(!showUpload)}
            variant="brand"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Interview
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-card rounded-lg border">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Interviews</div>
        </div>
        <div className="p-6 bg-card rounded-lg border">
          <div className="text-2xl font-bold text-nexa-green">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="p-6 bg-card rounded-lg border">
          <div className="text-2xl font-bold text-nexa-orange">{stats.processing}</div>
          <div className="text-sm text-muted-foreground">Processing</div>
        </div>
        <div className="p-6 bg-card rounded-lg border">
          <div className="text-2xl font-bold text-nexa-red">{stats.failed}</div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
      </div>

      {/* Upload Area */}
      {showUpload && (
        <div className="mb-8 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Upload New Interview</h2>
          <UploadArea />
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBar
          ref={searchInputRef}
          className="flex-1"
          placeholder="Search interviews by name or filename..."
        />
        <Button variant="outline" className="sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 bg-card rounded-lg border space-y-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-nexa-red mb-4">Failed to load interviews</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Interviews Grid */}
      {!isLoading && !error && (
        <>
          {filteredInterviews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎤</div>
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? 'No interviews found' : 'No interviews yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Upload your first interview to get started'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setShowUpload(true)}
                  variant="brand"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Interview
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};