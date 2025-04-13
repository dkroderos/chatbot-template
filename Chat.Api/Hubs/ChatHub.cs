using Chat.Api.Contracts;
using Chat.Api.Options;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Collections.Concurrent;
using System.Text;

namespace Chat.Api.Hubs;

public sealed class ChatHub(
    IChatCompletionService chat,
    IOptions<AppOptions> appOptions,
    ILogger<ChatHub> logger
) : Hub<IChatClient>
{
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> _sendLocks = new();

    public override Task OnConnectedAsync()
    {
        logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        return base.OnConnectedAsync();
    }

    // TODO -- Add cancellation token
    public async Task SendChat(ChatRequest request)
    {
        var connectionId = Context.ConnectionId;

        var semaphore = _sendLocks.GetOrAdd(connectionId, _ => new SemaphoreSlim(1, 1));

        if (!await semaphore.WaitAsync(0))
            return;

        try
        {
            var systemMessagesFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "SystemMessages"
            );
            var systemMessageFiles = Directory.GetFiles(systemMessagesFolder, "*.txt");
            var systemMessages = new StringBuilder();

            foreach (var file in systemMessageFiles)
            {
                try
                {
                    string content = File.ReadAllText(file);
                    systemMessages.AppendLine(content);
                }
                catch (Exception ex)
                {
                    logger.LogWarning("Failed to read file {File}: {Message}", file, ex.Message);
                }
            }

            var defaultSystemMessage = $$"""
                    {{systemMessages}}
                """;

            var chatHistory = new ChatHistory();

            chatHistory.AddSystemMessage(defaultSystemMessage);

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

            try
            {
                var responseDelay = appOptions.Value.ResponseDelay;

                await foreach (
                    var response in chat.GetStreamingChatMessageContentsAsync(chatHistory)
                )
                {
                    await Clients.Caller.ReceiveResponse(response.Content ?? string.Empty);
                    await Task.Delay(responseDelay);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(
                    "Something went wrong creating conversation: {Message}",
                    ex.Message
                );
                await Clients.Caller.ReceiveError("An error occurred while generating the response.");
            }

            await Clients.Caller.NotifyDone();
        }
        finally
        {
            semaphore.Release();
        }
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _sendLocks.TryRemove(Context.ConnectionId, out _);

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
