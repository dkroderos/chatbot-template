export interface ChatRequest {
  input: string;
  previousConversations: Conversation[];
}

export interface Conversation {
  message: string;
  response: string;
}
