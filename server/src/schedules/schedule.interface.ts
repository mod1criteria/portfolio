export interface Schedule {
  id: string;
  userId: string;
  title?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  allDay?: boolean;
  location?: string;
  participants?: string[];
  description?: string;
}
