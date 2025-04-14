interface ConversationRequestModel {
  message: string;
  response: string | undefined;
}

export interface ChatRequestModel {
  input: string;
  previousConversations: ConversationRequestModel[];
}

export interface ConversationModel {
  id: string;
  message: string;
  response: string | undefined;
}
