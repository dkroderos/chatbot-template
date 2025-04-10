namespace Chat.Api.Contracts;

public sealed record Conversation
{
    public required string Message { get; set; }
    public required string Response { get; set; }
}
