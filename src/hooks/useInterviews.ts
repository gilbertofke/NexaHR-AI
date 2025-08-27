import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Interview } from '../types/interview';

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
      // Update the interview status
      queryClient.setQueryData(['interview', id], (old: Interview | undefined) => {
        if (!old) return old;
        return { ...old, status: 'processing' as const };
      });
      
      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ['interview', id] });
    },
  });
};