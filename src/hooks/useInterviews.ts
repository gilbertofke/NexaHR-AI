import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Interview } from '../types/interview';
import { toast } from '../hooks/use-toast';

export const useInterviews = () => {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: () => apiClient.getInterviews(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInterview = (id: string) => {
  return useQuery({
    queryKey: ['interview', id],
    queryFn: () => apiClient.getInterview(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUploadInterview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => apiClient.uploadInterview(file),
    onSuccess: (data, file) => {
      // Add the new interview to the cache
      queryClient.setQueryData(['interviews'], (old: Interview[] | undefined) => {
        if (!old) return [];
        
        const newInterview: Interview = {
          id: data.id,
          filename: data.filename,
          original_name: file.name,
          file_size: file.size,
          upload_date: new Date().toISOString(),
          status: 'uploaded',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        return [newInterview, ...old];
      });
      
      // Invalidate interviews query to fetch updated data
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
};

export const useTranscribeInterview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.transcribeInterview(id),
    onSuccess: (_, id) => {
      toast({ title: 'Transcription started', description: 'We\'ll notify you when it\'s done.' });
      // Optimistically set detail status
      queryClient.setQueryData(['interview', id], (old: Interview | undefined) => {
        if (!old) return old;
        return { ...old, status: 'processing' as const };
      });
      // Optimistically set list item status
      queryClient.setQueryData(['interviews'], (old: Interview[] | undefined) => {
        if (!old) return old;
        return old.map((i) => (i.id === id ? { ...i, status: 'processing' as const } : i));
      });

      // After simulated processing, refetch to reflect completion from backend stub
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['interview', id] });
        queryClient.invalidateQueries({ queryKey: ['interviews'] });
        // Check status and notify user
        apiClient.getInterview(id)
          .then((data) => {
            if (data.status === 'completed') {
              toast({ title: 'Transcription completed', description: 'Transcript and analysis are ready.' });
            } else if (data.status === 'failed') {
              toast({ title: 'Transcription failed', description: 'Please try again.', variant: 'destructive' });
            }
          })
          .catch(() => {
            // ignore
          });
      }, 2600);
    },
    onError: () => {
      toast({ title: 'Failed to start transcription', description: 'Please try again.', variant: 'destructive' });
    },
  });
};

export const useDeleteInterview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteInterview(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['interviews'], (old: Interview[] | undefined) => {
        if (!old) return old;
        return old.filter((i) => i.id !== id);
      });
      queryClient.removeQueries({ queryKey: ['interview', id] });
    },
  });
};