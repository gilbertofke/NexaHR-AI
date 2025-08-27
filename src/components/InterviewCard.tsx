import { Calendar, FileAudio, FileVideo, HardDrive } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Interview } from '../types/interview';
import { Link } from 'react-router-dom';

interface InterviewCardProps {
  interview: Interview;
}

export const InterviewCard = ({ interview }: InterviewCardProps) => {
  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusVariant = (status: Interview['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'uploaded':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: Interview['status']) => {
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

  const isVideo = interview.filename.match(/\.(mp4|mov|avi|mkv)$/i);
  const FileIcon = isVideo ? FileVideo : FileAudio;

  return (
    <Link to={`/interview/${interview.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-brand rounded-lg group-hover:scale-110 transition-transform">
                <FileIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                  {interview.original_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {interview.filename}
                </p>
              </div>
            </div>
            
            <Badge 
              variant={getStatusVariant(interview.status)}
              className={`capitalize ${getStatusColor(interview.status)}`}
            >
              {interview.status}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-4 w-4" />
              <span>{formatFileSize(interview.file_size)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(interview.upload_date)}</span>
            </div>
          </div>

          {interview.status === 'completed' && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Transcript available</span>
                <span>Analysis ready</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};