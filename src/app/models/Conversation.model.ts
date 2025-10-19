export interface Conversation {
  ConversationId: string;
  SubcriberId: string;
  CreatedBy: string;
  Title: string;
  CreatedDate: string; // ISO datetime string
  TotalMessages: number;
}
