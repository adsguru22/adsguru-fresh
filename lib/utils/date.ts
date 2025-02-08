import { format } from 'date-fns';

export const formatTimestamp = (timestamp: number) => 
  format(new Date(timestamp), 'dd MMM yyyy HH:mm:ss');