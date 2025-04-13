export interface ChatRequestModel {
  input: string;
  previousConversations: ConversationModel[];
}

export interface ConversationModel {
  message: string;
  response: string;
}
