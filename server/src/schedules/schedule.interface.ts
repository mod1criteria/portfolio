export interface Schedule {
  id: string;
  userId: string;
  calendarId: string;
  title: string;
  startDateTime: string; // YYYYMMDDHHmmss
  endDateTime: string; // YYYYMMDDHHmmss
  allDay?: boolean;
  location?: string;
  alarm?: any; // Alarm object or null
  color?: string; // Hex color code
  isRepeat?: boolean; // Repeat rule or null
  repeatId?: string; // ID for recurring events
  participants?: any[];
  description?: string;
}
