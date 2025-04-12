using Chat.Api.Contracts;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Chat.Api.Hubs;

public sealed class MockChatHub(ILogger<MockChatHub> logger) : Hub<IChatClient>
{
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> _sendLocks = new();

    public override Task OnConnectedAsync()
    {
        logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        return base.OnConnectedAsync();
    }

    public async Task SendChat(ChatRequest request)
    {
        var connectionId = Context.ConnectionId;

        var semaphore = _sendLocks.GetOrAdd(connectionId, _ => new SemaphoreSlim(1, 1));

        if (!await semaphore.WaitAsync(0))
            return;

        try
        {
            var inputParts = request.Input.Split(" ", StringSplitOptions.RemoveEmptyEntries);

            foreach (var part in inputParts)
            {
                await Clients.Caller.ReceiveResponse(part + " ");
                await Task.Delay(15);
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
