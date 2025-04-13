namespace Chat.Api.Hubs;

public interface IChatClient
{
    Task ReceiveResponse(string response);
    Task NotifyDone();
    Task ReceiveError(string error);
}
