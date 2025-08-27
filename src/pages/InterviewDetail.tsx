import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, FileText, Download, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Player } from '../components/Player';
import { TranscriptView } from '../components/TranscriptView';
import { AnalysisPanel } from '../components/AnalysisPanel';
import { SearchBar } from '../components/SearchBar';
import { useInterview, useTranscribeInterview } from '../hooks/useInterviews';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useUIStore } from '../store/ui';
import { Skeleton } from '../components/ui/skeleton';

export const InterviewDetail = () => {
  const { id } = useParams<{ id: string }>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { data: interview, isLoading, error } = useInterview(id!);
  const transcribeMutation = useTranscribeInterview();
  const { currentTime, setCurrentTime } = useUIStore();

  useKeyboardShortcuts({ audioRef, searchInputRef });

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTranscribe = () => {
    if (id) {
      transcribeMutation.mutate(id);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-nexa-green bg-nexa-green/10';
      case 'processing':
        return 'text-nexa-orange bg-nexa-orange/10';
      case 'failed':
        return 'text-nexa-red bg-nexa-red/10';
      case 'uploaded':
        return 'text-nexa-blue bg-nexa-blue/10';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-nexa-red mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Interview Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The interview you're looking for doesn't exist or failed to load.
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{interview.original_name}</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
              <span>{formatFileSize(interview.file_size)}</span>
              <span>•</span>
              <span>{formatDate(interview.upload_date)}</span>
              <Badge className={`ml-2 ${getStatusColor(interview.status)}`}>
                {interview.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {interview.status === 'uploaded' && (
            <Button
              onClick={handleTranscribe}
              disabled={transcribeMutation.isPending}
              variant="brand"
            >
              <Play className="h-4 w-4 mr-2" />
              {transcribeMutation.isPending ? 'Starting...' : 'Transcribe'}
            </Button>
          )}
          
          {interview.status === 'completed' && interview.transcript && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {interview.transcript && (
        <div className="mb-6">
          <SearchBar
            ref={searchInputRef}
            placeholder="Search transcript..."
            className="max-w-md"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        {/* Left Panel - Player & Transcript */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          {/* Player */}
          <Player
            src={interview.file_path}
            fileName={interview.filename}
          />

          {/* Transcript */}
          {interview.status === 'completed' && interview.transcript ? (
            <div className="flex-1 bg-card border rounded-lg overflow-hidden">
              <TranscriptView
                transcript={interview.transcript}
                currentTime={currentTime}
                onSeek={handleSeek}
              />
            </div>
          ) : (
            <div className="flex-1 bg-card border rounded-lg flex items-center justify-center">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {interview.status === 'processing' ? 'Transcribing...' : 'No Transcript Available'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {interview.status === 'processing' 
                    ? 'Your interview is being transcribed. This may take a few minutes.'
                    : 'Start transcription to view the interview transcript.'
                  }
                </p>
                {interview.status === 'uploaded' && (
                  <Button 
                    onClick={handleTranscribe}
                    disabled={transcribeMutation.isPending}
                    variant="brand"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Transcription
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Analysis */}
        <div className="bg-card border rounded-lg overflow-hidden">
          {interview.status === 'completed' && interview.analysis ? (
            <AnalysisPanel
              analysis={interview.analysis}
              interviewId={interview.id}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center py-12 px-6">
                <div className="h-12 w-12 bg-gradient-brand rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Analysis Pending</h3>
                <p className="text-muted-foreground text-sm">
                  Analysis will be available once transcription is complete.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};