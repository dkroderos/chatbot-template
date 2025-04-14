using Chat.Api.Contracts;
using Chat.Api.Options;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using System.Runtime.CompilerServices;

namespace Chat.Api.Hubs;

public sealed class MockChatHub(IOptions<AppOptions> appOptions, ILogger<MockChatHub> logger) : Hub
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
        var inputParts = request.Input.Split(" ", StringSplitOptions.RemoveEmptyEntries);
        var responseDelay = appOptions.Value.ResponseDelay;

        foreach (var part in inputParts)
        {
            cancellationToken.ThrowIfCancellationRequested();
            yield return part + " ";
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
