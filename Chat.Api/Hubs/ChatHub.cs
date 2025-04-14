using Chat.Api.Contracts;
using Chat.Api.Options;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Runtime.CompilerServices;

namespace Chat.Api.Hubs;

public sealed class ChatHub(
    IChatCompletionService chat,
    IOptions<AppOptions> appOptions,
    ILogger<ChatHub> logger
) : Hub
{
    public override Task OnConnectedAsync()
    {
        logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        return base.OnConnectedAsync();
    }

    public async IAsyncEnumerable<string> StreamChat(
        ChatRequest request,
        [EnumeratorCancellation] CancellationToken cancellationToken
    )
    {
        var systemMessagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "SystemMessages");
        var systemMessageFiles = Directory.GetFiles(systemMessagesFolder, "*.txt");

        var chatHistory = new ChatHistory();

        foreach (var file in systemMessageFiles)
        {
            try
            {
                var content = File.ReadAllText(file);
                chatHistory.AddSystemMessage(content);
            }
            catch (Exception ex)
            {
                logger.LogWarning("Failed to read file {File}: {Message}", file, ex.Message);
            }
        }

        var maxPreviousConversations = appOptions.Value.MaxPreviousConversations;

        foreach (
            var conversation in request
                .PreviousConversations.Take(maxPreviousConversations)
                .Reverse()
        )
        {
            chatHistory.AddUserMessage(conversation.Message);
            chatHistory.AddSystemMessage(conversation.Response);
        }

        chatHistory.AddUserMessage(request.Input);

        var responseDelay = appOptions.Value.ResponseDelay;

        await foreach (
            var response in chat.GetStreamingChatMessageContentsAsync(
                chatHistory,
                cancellationToken: cancellationToken
            )
        )
        {
            cancellationToken.ThrowIfCancellationRequested();
            yield return response.Content ?? string.Empty;
            await Task.Delay(Math.Max(0, responseDelay), cancellationToken);
        }
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        if (exception != null)
            logger.LogWarning(
                exception,
                "Client disconnected with error: {ConnectionId}",
                Context.ConnectionId
            );
        else
            logger.LogInformation("Client disconnected: {ConnectionId}", Context.ConnectionId);

        return base.OnDisconnectedAsync(exception);
    }
}
