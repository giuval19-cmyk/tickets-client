export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'PENDING_CUSTOMER'
  | 'RESOLVED'
  | 'CLOSED';

export type TicketPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export interface Ticket {
  id: string;
  userEmail: string;
  subject: string;
  message: string;
  sourceApp: string;
  status: TicketStatus;
  priority: TicketPriority;
  operatorNotes : string[];
}