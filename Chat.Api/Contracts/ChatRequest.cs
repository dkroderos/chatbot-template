namespace Chat.Api.Contracts;

public sealed record ChatRequest
{
    public required string Input { get; init; }
    public required List<Conversation> PreviousConversations { get; init; } = [];
}

