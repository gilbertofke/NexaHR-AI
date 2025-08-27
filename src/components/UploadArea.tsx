import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useUploadInterview } from '../hooks/useInterviews';
import { toast } from '../hooks/use-toast';
import { UploadProgress } from '../types/interview';

const ACCEPTED_TYPES = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const UploadArea = () => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const uploadMutation = useUploadInterview();

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            toast({
              title: 'File too large',
              description: `${file.name} exceeds 100MB limit`,
              variant: 'destructive',
            });
          } else if (error.code === 'file-invalid-type') {
            toast({
              title: 'Invalid file type',
              description: `${file.name} is not a supported format`,
              variant: 'destructive',
            });
          }
        });
      });

      // Process accepted files
      for (const file of acceptedFiles) {
        const uploadId = `upload-${Date.now()}-${Math.random()}`;
        
        setUploads(prev => [...prev, {
          file,
          progress: 0,
          status: 'uploading',
        }]);

        try {
          await uploadMutation.mutateAsync(file);
          
          setUploads(prev => prev.map(upload => 
            upload.file === file 
              ? { ...upload, progress: 100, status: 'completed' }
              : upload
          ));

          toast({
            title: 'Upload successful',
            description: `${file.name} has been uploaded`,
          });
        } catch (error) {
          setUploads(prev => prev.map(upload => 
            upload.file === file 
              ? { 
                  ...upload, 
                  status: 'error', 
                  error: error instanceof Error ? error.message : 'Upload failed'
                }
              : upload
          ));

          toast({
            title: 'Upload failed',
            description: `Failed to upload ${file.name}`,
            variant: 'destructive',
          });
        }
      }
    },
    [uploadMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const removeUpload = (file: File) => {
    setUploads(prev => prev.filter(upload => upload.file !== file));
  };

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-pulse text-nexa-blue" />;
      case 'processing':
        return <FileAudio className="h-4 w-4 animate-pulse text-nexa-orange" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-nexa-green" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-nexa-red" />;
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-lg text-primary font-medium">Drop files here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium mb-2">
              Drag & drop interview files here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports MP3, WAV, MP4, MOV • Max 100MB per file
            </p>
            <Button variant="outline" size="sm">
              Choose Files
            </Button>
          </div>
        )}
      </div>

      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload, index) => (
            <div key={index} className="p-4 bg-card rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(upload.status)}
                  <span className="text-sm font-medium truncate">
                    {upload.file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({(upload.file.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUpload(upload.file)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              {upload.status === 'uploading' && (
                <Progress value={upload.progress} className="h-2" />
              )}
              
              {upload.status === 'error' && upload.error && (
                <p className="text-xs text-nexa-red mt-1">{upload.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};